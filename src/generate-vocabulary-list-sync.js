// node packages
const fs = require("fs");
const http = require("http");

// local packages
const {mecabSync} = require("./mecab-wrapper");
const {lookup} = require("./jsdict-lookup");
const symbols = require("./mecab-symbols.json");

// safe array handling
Array.prototype.contains = function(item){
	return this.indexOf(item) !== -1;
}

function __array(data){
	if(Array.isArray(data)) return data;
	if(!data) return [];
	return [data];
}

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

// token analyzers
function tokenIsNoun(token){ return token.pos === symbols.pos.noun; }
function tokenIsVerb(token){ return token.pos === symbols.pos.verb; }
function tokenIsIAdj(token){ return token.pos === symbols.pos.i_adj; }
function tokenIsNaAdj(token){ return token.pos2 === symbols.pos2.na_adj; }
function tokenIsAdjective(token){ return tokenIsIAdj(token) || tokenIsNaAdj(token); }
function tokenIsAdverb(token){ return token.pos === symbols.pos.adverb; }
function tokenIsBasic(token){ return tokenIsNoun(token) || tokenIsVerb(token) || tokenIsAdjective(token) || tokenIsAdverb(token); }

async function _read_stdin(callback){
	return new Promise(function(resolve){
		process.stdin.once("data", function(data){
			callback(data);
			resolve();
		});
	});
}

async function readLine(){
	let line;
	await _read_stdin(function(data){
		line = data;
	});

	return line;
}

async function sleep(time){
	return new Promise(function(resolve){
		setTimeout(resolve, time);
	});
}

const COLOR = {
	HIGHLIGHT: "\u001b[33;1m\u001b[44m",
	RESET: "\u001b[0m"
}

// local consts
const inputFolder = "../scene/processed/";
const outputFolderNew = "../vocabulary/new/";
//const outputFolderUnique = "../vocabulary/unique/";

// local data
const lookupWords = []; // token roots (words) that have been searched for (don't repeat these)
const wordsFound = []; // jsdict entries that we've chosen go here (just the text sequence of the entry)

// scroll through files
fs.readdir(inputFolder, async function(err, files){
	if(err) {
		console.log(err);
		return;
	}

	console.log(`Scraping scenes for vocabulary...`);
	for(let file of files){
		console.log(`\t${file}`)
		let sceneLines = [];
		let text = fs.readFileSync(inputFolder+file, "utf8");
		let lines = text.split("\r\n");
		for(let i=0;i<lines.length;i++){
			let line = lines[i];
			let split = line.split("\t");
			let english = split[0];
			let japanese = split[1];
			let tokens = await mecabSync(japanese);
			for(let j=0;j<tokens.length;j++){
				let reconstructed = [];
				for(let k=0;k<tokens.length;k++) {
					if(k===j) reconstructed.push(`${COLOR.HIGHLIGHT}${tokens[k].word}${COLOR.RESET}`);
					else reconstructed.push(tokens[k].word);
				}
				let token = tokens[j];
				if(!token.root) continue; // fake words
				if(lookupWords.contains(token.root)) continue; // ignore past searches
				lookupWords.push(token.root);
				let spec;
				if(tokenIsNoun(token)) spec = symbols.pos.noun;
				else if(tokenIsVerb(token)) spec = symbols.pos.verb;
				else if(tokenIsIAdj(token)) spec = symbols.pos.i_adj;
				else if(tokenIsNaAdj(token)) spec = symbols.pos2.na_adj;
				else if(tokenIsAdverb(token)) spec = symbols.pos.adverb;
				else continue;
				let search = lookup(`${token.root}`);
				console.log(`\tDisambiguating line ${i+1}/${lines.length}...`);
				console.log(`\t\tEnglish:\t${english}`);
				console.log(`\t\tJapanese:\t${reconstructed.join("")}`);
				console.log(`\t\tWord:\t\t${token.word} ('${token.root}' ${token.pos})`);
				console.log("");
				if(search){
					if(!search.length) {
						console.log("\t\tNo results.");
						console.log("");
						continue;
					}

					console.log("\t\tOptions");
					console.log("\t\t-------")
					for(let k=0;k<search.length;k++){
						let entry = search[k];
						let word = formatWord(entry);
						let def = formatSense(entry);
						let display = word.kanji ? `${word.kanji}[${word.kana}]` : word.kana;
						console.log(`\t\t${k}) ${display} (${def.pos}) ${def.gloss}`);
					}

					console.log("\t\tPress enter or type 'skip' to skip this word.")
					console.log("\t\t-------");
					let choice;
/*					if(json.length === 1) {
						console.log("\t\tAutomatically choosing first result.")
						await sleep(500);
						choice = json[0];
					} else {*/
					if(1){
						while(true){
							process.stdout.write("\t\tYour choice: "); // add line without break
							let input = await readLine(); // read line from stdin
							if(input == "skip\r\n" || input == "\r\n"){
								break;
							}
							let num = new Number(input);
							if(num<0 || num >= search.length || isNaN(num)) {
								console.log(`\t\t${num} is out of bounds.`);
								continue;
							}

							choice = search[num];
							break;
						}
					}

					if(!choice){
						console.log("\t\tNo choice made. Skipping word.");
						console.log("");
						continue;
					}

					if(wordsFound.contains(choice.ent_seq)) { // ignore
						console.log("\t\tIgnoring duplicate.");
						console.log("");
						continue;
					}

					wordsFound.push(choice.ent_seq);
					let word = formatWord(choice);
					let def = formatSense(choice);
					sceneLines.push(`${word.kana}\t${word.kanji?word.kanji:""}\t${def.pos}\t${def.gloss}\t${english}\t${japanese}`)
					console.log("");
				}
			}

		}

		fs.writeFileSync(outputFolderNew+file, sceneLines.join("\r\n"), "utf8");
	}
});