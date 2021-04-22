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
const foundWords = [];
const foundRoots = [];

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
	let text = [];
	for(let entry of sense){
		let current = [];
		if(entry.pos) current.push(`(${__array(entry.pos).join(", ")})`);
		current.push(`${__array(entry.gloss).join(", ")}`);
		text.push(current.join(" "));
	}

	return text.join("; ");
}

function formatWord(word){
	let k_ele = __array(word.k_ele);
	let r_ele = __array(word.r_ele);
	if(k_ele.length) return `${k_ele[0].keb}\t${r_ele[0].reb}`;
	else if(r_ele.length) return `\t${r_ele[0].reb}`;
}

// read all processed texts and scrape kanji data
console.log(`Generating tables for scenes:`);
function finish(){
	console.log("DONE.");
}

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
				sceneWords.forEach(function(value){ nLines.push(`${value.definition}\t${value.line}`); });
				fs.writeFileSync(outputFolderNew+file, nLines.join("\r\n"), "utf8");

				nextFile();
				return;
			}

			let line = lines[i];
			console.log(file, i, line);

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
					if(!tokenIsBasic(token)) return nextToken();
					let word = {word: token.root, scene: file, line: line, definition:null};
	
					// add to scene list (only unique words in this scene)
					if(sceneRoots.indexOf(token.root)===-1){
					}
	
					// add to complete list (only absolutely new words)
					if(foundRoots.indexOf(token.root)===-1){
						foundWords.push(word);
						foundRoots.push(token.root);
						sceneRoots.push(word.root);
						sceneWords.push(word);
					}

					// lookup definitions
					http.get(`http://localhost:666/lookup/${encodeURI(token.root)}`, function(res){
						let data = "";
						res.on("data", function(chunk){ data += chunk; });
						res.on("end", function(){
							let json = JSON.parse(data);
							if(!json || !json.length) return nextToken();
							let first = json[0];
							word.definition = `${formatWord(first)}\t${formatSense(first)}`;
							nextToken();
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