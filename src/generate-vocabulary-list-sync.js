// node packages
const fs = require("fs");
const http = require("http");

// local packages
const {mecabSync} = require("./mecab-wrapper");
const {lookupSync} = require("./jsdict-lookup");
const symbols = require("./mecab-symbols.json");
const { stdin } = require("process");

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

async function _read(callback){
	return new Promise(function(resolve){
		process.stdin.once("data", function(data){
			callback(data);
			resolve();
		});
	});
}

async function readLine(){
	let line;
	await _read(function(data){
		line = data;
	});

	return line;
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

	for(let file of files){
		console.log(`\t${file}`)
		let sceneLines = [];
		let text = fs.readFileSync(inputFolder+file, "utf8");
		let lines = text.split("\r\n");
		for(let line of lines){
			let split = line.split("\t");
			let english = split[0];
			let japanese = split[1];
			let tokens = await mecabSync(japanese);
			for(let token of tokens){
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
				console.log("Disambiguate:");
				console.log(`\tWord:\t\t${token.word} (spec: ${spec})`);
				console.log(`\tEnglish:\t${english}`);
				console.log(`\tJapanese:\t${japanese}`);
				console.log("");
				console.log("Options:");
				let search = await lookupSync(`${token.root}/${spec}`);
				if(search){
					let json = __array(JSON.parse(search));
					if(!json.length) {
						console.log("No results.");
						console.log("");
						continue;
					}
					for(let i=0;i<json.length;i++){
						let entry = json[i];
						let word = formatWord(entry);
						let def = formatSense(entry);
						let display = word.kanji ? `${word.kanji}[${word.kana}]` : word.kana;
						console.log(`\t${i}) ${display} (${def.pos}) ${def.gloss}`);
					}

					let first = json[0];
					if(wordsFound.contains(first.ent_seq)) { // ignore
						console.log("Ignoring duplicate.");
						console.log("");
						continue;
					}

					console.log("");
					console.log("Automatically choosing first result.")
					wordsFound.push(first.ent_seq);
					let word = formatWord(first);
					let def = formatSense(first);
					sceneLines.push(`${word.kana}\t${word.kanji?word.kanji:""}\t${def.pos}\t${def.gloss}\t${english}\t${japanese}`)

/*					console.log("\t* Press Enter to Skip *");
					console.log("");
					process.stdout.write("Make a choice: ");*/
//					let choice = await readLine();
					console.log("");
				}
			}

		}

		fs.writeFileSync(outputFolderNew+file, sceneLines.join("\r\n"), "utf8");
	}
});