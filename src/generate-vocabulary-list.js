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
const outputFolder = "../vocabulary/unprocessed/";
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
		if(file.indexOf(".txt") == -1) continue; // not a scene file
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
					if(k===j) reconstructed.push(`[${tokens[k].word}]`);
					else reconstructed.push(tokens[k].word);
				}
				let token = tokens[j];
				if(!token.root) continue; // fake words?
				if(lookupWords.contains(token.root)) continue; // ignore past searches
				// i actually think I should remove this, since it could be necessary
				// to disambiguate 2 words with the same root. but removing this
				// makes the files too big. too much extra work. no thanks.
				lookupWords.push(token.root);
				if(!tokenIsBasic(token)) continue; // not a verb, noun, adjective, or adverb
				let search = lookup(`${token.root}`);
				if(!search.length) continue;
				let definitions = [];
				for(let k=0;k<search.length;k++){
					let entry = search[k];
					let word = formatWord(entry);
					let def = formatSense(entry);
					let display = word.kanji ? `${word.kanji}[${word.kana}]` : word.kana;
					definitions.push(`${display} (${def.pos}) ${def.gloss}`);
				}

				sceneLines.push({word:token.word, root:token.root, definitions:definitions, english:english, japanese:reconstructed.join("")});
			}

		}

		let fName = file.substring(0,file.length-4);
		fs.writeFileSync(outputFolder+fName+".json", JSON.stringify(sceneLines, null, "\t"), "utf8");
	}
});