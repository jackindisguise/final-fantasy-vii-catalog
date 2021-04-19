// node packages
const fs = require("fs");

// local consts
const inputFolder = "../scene/processed/";
const outputFolderNewKanji = "../kanji/new/";
const outputFolderUniqueKanji = "../kanji/unique/";
const outputFile = "kanji.json";

// local data
let kanji = {};
let kanjiArray = [];
let kanjiCount = 0;

// read all processed texts and scrape kanji data
fs.readdir(inputFolder, function(err, files){
	if(err) return;
	for(let file of files){
		let uniqueKanjiInScene = [];
		let newKanjiInScene = [];
		let complete = inputFolder+file;
		if(complete.indexOf(".txt") === -1) continue;
		let data = fs.readFileSync(inputFolder+file, "utf8");
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
		console.log(`Generated new and unique kanji list for scene '${file}'`)
	}

	fs.writeFileSync(outputFile, JSON.stringify({unique:kanjiArray.length, total:kanjiCount, table:kanjiArray}, null, "\t"), "utf8");
	console.log("Generated kanji table.")
});