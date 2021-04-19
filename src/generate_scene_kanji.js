// node packages
const fs = require("fs");

// local consts
const inputSceneFolder = "../scene/processed/";
const inputNewFolder = "../kanji/new/";
const inputUniqueFolder = "../kanji/unique/";
const outputComprehensiveFile = "../kanji/COMPREHENSIVE.md";

// kanji data
const kanji = require("./kanji");

// other
let kanjiRule = /([\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A])/g;
let scenes = [];

fs.readdir(inputNewFolder, function(err, files){
	for(let file of files){
		if(file.indexOf(".txt") === -1) continue;
		let newKanjiData = fs.readFileSync(inputNewFolder+file, "utf8");
		let nSplit = newKanjiData.split("");
		let uniqueKanjiData = fs.readFileSync(inputUniqueFolder+file, "utf8");
		let uSplit = uniqueKanjiData.split("");
		let sceneData = fs.readFileSync(inputSceneFolder+file, "utf8");
		let count = 0;
		sceneData.match(kanjiRule).forEach(function(){ count++; });
		let sceneName = file.substring(5, file.indexOf(".txt"));
		let line = [];
		line.push(`${sceneName}`);
		line.push("---");
		line.push(`* There are **${count}** total kanji that appear in this scene.`);
		line.push(`* There are **${uSplit.length}** unique kanji that appear in this scene.`);
		line.push(`* There are **${nSplit.length}** kanji that are introduced for the first time in this scene.`);
		line.push(`* That's **${(nSplit.length / kanji.unique*100).toFixed(2)}%** of the unique kanji in the entire script.`);
		scenes.push(line.join("\r\n"));
	}

	fs.writeFileSync(outputComprehensiveFile, scenes.join("\r\n\r\n"), "utf8");
});

