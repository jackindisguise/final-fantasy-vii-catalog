/**
 * This shit is disgusting.
 * I have like 9 asynchronous things going on.
 * I don't know of a good way to do this.
 */

// node packages
const fs = require("fs");
const http = require("http");

// local packages
const mecab = require("./mecab-wrapper");
const symbols = require("./mecab-symbols.json");

// local consts
const inputFolder = "../scene/split/japanese/";
const outputFolderNew = "../vocabulary/new/";
const outputFolderUnique = "../vocabulary/unique/";
const searchedWords = [];
const foundWords = [];
const usedDictEntries = [];
const sceneWords = [];
const sceneUsedDictEntries = [];

// safe array handling
function __array(data){
	if(Array.isArray(data)) return data;
	if(!data) return [];
	return [data];
}

// token analyzers
function tokenIsNoun(token){ return token.pos === symbols.pos.noun; }
function tokenIsVerb(token){ return token.pos === symbols.pos.verb; }
function tokenIsAdjective(token){ return (token.pos === symbols.pos.i_adj) || (token.pos2 === symbols.pos.na_adj); }
function tokenIsAdverb(token){ return token.pos === symbols.pos.adverb; }
function tokenIsBasic(token){ return tokenIsNoun(token) || tokenIsVerb(token) || tokenIsAdjective(token) || tokenIsAdverb(token); }

// jsdict formatters
function formatSense(word){
	let sense = __array(word.sense);
	let formatted = {pos:null, gloss:[]};
	for(let entry of sense){
		let current = [];
		if(entry.pos) formatted.pos = `${__array(entry.pos).join(", ")}`
		formatted.gloss.push(`${__array(entry.gloss).join(", ")}`);
	}

	return formatted;
}

function formatWord(word){
	let formatted = {kana: null, kanji: null};
	let k_ele = __array(word.k_ele);
	let r_ele = __array(word.r_ele);
	if(k_ele.length) formatted.kanji = k_ele[0].keb;
	if(r_ele.length) formatted.kana = r_ele[0].reb;
	return formatted;
}

// read all processed texts and scrape vocabulary
console.log(`Scraping scenes for vocabulary:`);
function finish(){
	console.log("DONE.");
}

// read from stdin
process.stdin.resume();

fs.readdir(inputFolder, function(err, files){
	let j = -1;

	// file iterator
	function nextFile(){
		j++;
		if(j >= files.length) {
			finish();
			return;
		}
		let file = files[j];
		let sceneWords = [];
		let sceneRoots = [];
		let data = fs.readFileSync(inputFolder+file, "utf8");
		let lines = data.split("\r\n");
		let i = -1;

		// line iterator
		function nextLine(){
			i++;
			if(i>=lines.length) {
				// unique lines
/*				let uLines = [];
				sceneWords.forEach(function(value){ uLines.push(`${value.word}\t${value.line}`); });
				fs.writeFileSync(outputFolderUnique+file, uLines.join("\r\n"), "utf8");*/

				// new lines
				let nLines = [];
				sceneWords.forEach(function(value){
					let word = formatWord(value.definition);
					let sense = formatSense(value.definition);
					nLines.push(`${word.kanji}\t${word.kana}\t${sense.pos}\t${sense.gloss}\t${value.line}`);
				});
				fs.writeFileSync(outputFolderNew+file, nLines.join("\r\n"), "utf8");

				nextFile();
				return;
			}

			let line = lines[i];

			// process through mecab
			mecab(line, function(err, tokens){
				let k = -1;
				function nextToken(){
					k++;
					if(k>=tokens.length){
						nextLine();
						return;
					}

					let token = tokens[k];
					if(!token.root) return nextToken();
					if(searchedWords.indexOf(token.root) !== -1) return nextToken();
					if(!tokenIsBasic(token)) return nextToken();
					console.log(file, i+1, line, `'${token.root}'`);
					searchedWords.push(token.root);
					let word = {word: token.root, scene: file, line: line, definition:null};

					// lookup definitions
					http.get(`http://localhost:666/lookup/${encodeURI(token.root)}`, function(res){
						let data = "";
						res.on("data", function(chunk){ data += chunk; });
						res.on("end", function(){
							let json = JSON.parse(data);
							function listOptions(){
								console.log(`Choose a disambiguation for '${token.root}':`);
								for(let z=0;z<json.length;z++) {
									let _word = formatWord(json[z]);
									let _definition = formatSense(json[z]);
									let used = (usedDictEntries.indexOf(json[z].ent_seq) !== -1);
									console.log(`${z+1})${used?"***":""} ${_word.kana}${_word.kanji ? " "+_word.kanji : ""}: (${_definition.pos}) ${_definition.gloss}`);
								}
							}

							function askForNumber(){
								process.stdout.write("Your choice: ")
								process.stdin.once("data", function(chunk){
									let num = new Number(chunk);
									if(chunk == "\r\n") { console.log("Skipped."); console.log(""); return nextToken(); }
									if(num > 0 && num <= json.length) {
										let choice = json[num-1];
										let used = (usedDictEntries.indexOf(choice.ent_seq) !== -1);
										if(!used){
											word.definition = choice;
											usedDictEntries.push(choice.ent_seq);
											foundWords.push(word);
											sceneWords.push(word);
										}
									} else {
										console.log("Not an option. Try again.");
										console.log("");
										listOptions();
										askForNumber();
										return;
									}
									process.stdin.removeAllListeners();
									console.log("");
									nextToken();
								});

							}

							if(!json || !json.length) { console.log(`No results for ${token.root}.`); return nextToken(); }
							if(json.length>1){
								listOptions();
								askForNumber();
							} else {
								let choice = json[0];
								let _word = formatWord(choice);
								let _definition = formatSense(choice);
								console.log(`Automatically chose definition for '${token.root}':`);
								console.log(`${(_word.kanji ? `${_word.kanji} ` : "")}${_word.kana} (${_definition.pos}) ${_definition.gloss}`);
								console.log("");
								let used = (usedDictEntries.indexOf(choice.ent_seq) !== -1);
								if(!used){
									usedDictEntries.push(choice.ent_seq);
									foundWords.push(word);
									sceneWords.push(word);
								}
								nextToken()
							}
						});
					});
				}

				nextToken();
			});
		}

		// start processing lines
		nextLine();
	}

	// start processing files
	nextFile();
});