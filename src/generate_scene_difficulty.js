// node packages
const fs = require("fs");

// local consts
const inputSceneFolder = "../scene/processed/";
const inputNewFolder = "../kanji/new/";
const inputUniqueFolder = "../kanji/unique/";
const outputComprehensiveFolder = "../kanji/comprehensive/";

// kanji data
const kanji = require("./kanji");
let scenes = {};

// other
let kanjiRule = /([\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A])/g;

fs.readdir(inputNewFolder, function(err, files){
	for(let file of files){
		if(file.indexOf(".txt") === -1) continue;
		let kanjiData = fs.readFileSync(inputNewFolder+file, "utf8");
		let split = kanjiData.split("");
		let sceneData = fs.readFileSync(inputSceneFolder+file, "utf8");
		let count = 0;
		sceneData.match(kanjiRule).forEach(function(){ count++; });
		let sceneName = file.substring(5, file.indexOf(".txt"));
		let line = [];
		line.push(`${sceneName}`);
		line.push("---");
		line.push(`* There are **${count}** total kanji that appear in this scene.`);
		line.push(`* There are **${split.length}** kanji that are introduced for the first time in this scene.`);
		line.push(`* That's **${(split.length / kanji.unique*100).toFixed(2)}%** of the unique kanji in the entire script.`);
		let safe = file.substring(0, file.length-4);
		fs.writeFileSync(outputComprehensiveFolder+safe+".md", line.join("\r\n"), "utf8");
	}
});