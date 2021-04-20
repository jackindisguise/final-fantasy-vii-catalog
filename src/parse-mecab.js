// node packages
const { exec } = require("child_process");
const fs = require("fs");

const mecab = "C:\\Program Files (x86)\\MeCab\\bin\\mecab.exe";

exec(`"${mecab}" in.txt`, function(err,stdout,stderr){
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

		console.log(token);
	}
});