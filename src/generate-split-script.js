// node packages
const fs = require("fs");

// local packages
const xterm = require("./xterm-color");

// program settings
let verbose = true;

// parse arguments
for(let argument of process.argv){
	if(argument === "-q") verbose = false;
	else if(argument === "-v") verbose = true;
}

// local consts
const inputFolder = "../scene/processed/";
const outputFolderEnglish = "../scene/split/english/";
const outputFolderJapanese = "../scene/split/japanese/";
const outputFolderEnglishLines = "../scene/line/english/";
const outputFolderJapaneseLines = "../scene/line/japanese/";

// other
let allSource = [];
let allTarget = [];

// read all processed texts and scrape kanji data
console.log(`Splitting English/Japanese dialogue.`);
fs.readdir(inputFolder, function(err, files){
	if(err) return;
	for(let file of files){
		if(file.indexOf(".txt") === -1) continue;
		if(file === "combined.txt") continue;
		let noext = file.substring(0,file.length-4);
		let num = new Number(noext.substring(0,2));
		let name = noext.substring("00 - ".length);
		let data = fs.readFileSync(inputFolder+file, "utf8");
		let sourceLines = [];
		let targetLines = [];
		let lines = data.split("\r\n");
		for(let i=0;i<lines.length;i++){
			let line = lines[i];
			let split = line.split("\t");
			let source = split[0];
			let target = split[1];
			sourceLines.push(source);
			allSource.push(source);
			targetLines.push(target);
			allTarget.push(target);
		}

		fs.writeFileSync(outputFolderEnglish+file, sourceLines.join("\r\n"), "utf8");
		fs.writeFileSync(outputFolderJapanese+file, targetLines.join("\r\n"), "utf8");
		if(verbose) console.log(`\t[${xterm.C.YELLOW}${num.toString().padStart(2, "0")}${xterm.C.RESET}]: ${xterm.C.PINK}${name}${xterm.C.RESET}`);
	}

	fs.writeFileSync(outputFolderEnglish+"combined.txt", allSource.join("\r\n"), "utf8");
	console.log(`Combined all English dialogue into one file: '${outputFolderEnglish+"combined.txt"}'`)
	fs.writeFileSync(outputFolderJapanese+"combined.txt", allTarget.join("\r\n"), "utf8");
	console.log(`Combined all Japanese dialogue into one file: '${outputFolderJapanese+"combined.txt"}'`)
});