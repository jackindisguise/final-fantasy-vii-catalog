// node packages
const { exec } = require("child_process");
const fs = require("fs");

const symbols = require("./mecab-symbols");

const mecab = "C:\\Program Files (x86)\\MeCab\\bin\\mecab.exe";
const file = "../scene/split/japanese/02 - Train and Sector 7 Night.txt";

let words = [];

exec(`"${mecab}" "${file}"`, function(err,stdout,stderr){
	let lines = stdout.split("\r\n");
	let tokens = [];
	for(let line of lines){
		if(line === "EOS") continue;
		if(line === "") continue;
		let split = line.split("\t");
		let word = split[0];
		let meta = split[1].split(",");
		for(let i=0;i<meta.length;i++) {
			if(meta[i] == "*") meta[i] = null;
			else if(meta[i].indexOf("／") !== -1) meta[i] = meta[i].split("／");
		}
	
		let token = {
			word: word,
			pos: meta[0],
			pos2: meta[1],
			unk: meta[2],
			unk2: meta[3],
			form: meta[4],
			form2: meta[5],
			root: meta[6],
			readingKana: meta[7],
			readingKata: meta[8]
		};

		if(!token.root) continue;
		if(tokenIsNoun(token) && words.indexOf(token.root) === -1) words.push(token.root);
		if(tokenIsVerb(token) && words.indexOf(token.root) === -1) words.push(token.root);
		if(tokenIsAdjective(token) && words.indexOf(token.root) === -1) words.push(token.root);
		if(tokenIsAdverb(token) && words.indexOf(token.root) === -1) words.push(token.root);
	}

	console.log(words);
});

function tokenIsNoun(token){
	return token.pos === symbols.pos.noun;
}

function tokenIsVerb(token){
	return token.pos === symbols.pos.verb;
}

function tokenIsAdjective(token){
	return token.pos === symbols.pos.i_adjective || token.pos2 === symbols.pos.na_adj;
}

function tokenIsAdverb(token){
	return token.pos === symbols.pos.adverb;
}