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
const inputFolder = "../scene/formatted/";
const outputFolderNewKanji = "../kanji/new/";
const outputFolderUniqueKanji = "../kanji/unique/";
const outputFile = "kanji.json";

// local data
let kanji = {};
let kanjiArray = [];
let kanjiCount = 0;

// read all processed texts and scrape kanji data
console.log("Scraping kanji from formatted scenes.");
fs.readdir(inputFolder, function(err, files){
	if(err) return;
	for(let file of files){
		if(file.indexOf(".txt") === -1) continue;
		if(file === "combined.txt") continue;

		// read file data
		let noext = file.substring(0,file.length-4);
		let num = new Number(noext.substring(0,2));
		let name = noext.substring("00 - ".length);
		let data = fs.readFileSync(inputFolder+file, "utf8");

		// collect unique/new kanji
		let uniqueKanjiInScene = [];
		let newKanjiInScene = [];

		// scrape kanji
		let kanjiRule = /([\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A])/g;
		let x = data.match(kanjiRule);
		if(x) data.match(kanjiRule).forEach(function(value, index, results){
			kanjiCount++;
			if(uniqueKanjiInScene.indexOf(value) === -1) uniqueKanjiInScene.push(value); // track all unique kanji in this scene
			if(!kanji[value]) { // create new entry
				kanji[value] = {kanji:value, order:kanjiArray.length+1, occurrences:1};
				newKanjiInScene.push(value); // track all new kanji in this scene
				kanjiArray.push(kanji[value]);
			} else { // update entry
				kanji[value].occurrences++;
			}
		});

		let uniqueKanjiFile = outputFolderUniqueKanji + file;
		let newKanjiFile = outputFolderNewKanji + file;
		fs.writeFileSync(uniqueKanjiFile, uniqueKanjiInScene.join(""), "utf8");
		fs.writeFileSync(newKanjiFile, newKanjiInScene.join(""), "utf8");
		if(verbose) console.log(`\t[${xterm.C.YELLOW}${num.toString().padStart(2, "0")}${xterm.C.RESET}]: ${xterm.C.PINK}${name}${xterm.C.RESET} (${xterm.C.LIME}${newKanjiInScene.length} new kanji${xterm.C.RESET})`);
	}

	fs.writeFileSync(outputFile, JSON.stringify({unique:kanjiArray.length, total:kanjiCount, table:kanjiArray}, null, "\t"), "utf8");
	console.log(`Generated ${outputFile}`);
});