// node includes
const fs = require("fs");

// local consts
const inputDir = "../scene/processed/";
const outputDir = "../anki/scene/";
let kanjiRule = /([\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A])/g;

// save all lines for combination
let combined = [];

console.log("Converting processed scenes to anki imports:");
fs.readdir(inputDir, function(err, files){
	if(err) return;
	for(let file of files){
		if(file.indexOf(".txt") === -1) continue;
		if(file === "combined.txt") continue // we'll make our owns
		let noext = file.substring(0,file.length-4);
		let num = new Number(noext.substring(0,2));
		let name = noext.substring("00 - ".length);
		let data = fs.readFileSync(inputDir+file, "utf8");

		// split lines
		let lines = data.split("\r\n");
		let formatted = [];
		for(let line of lines) {
			let split = line.split("\t");
			let english = split[0];
			let japanese = split[1];
			let kanji = japanese.match(kanjiRule) || [];
			let format = `${japanese}\t${english}\t${kanji.join("")}\tscene_${num.toString().padStart(2, "0")}`;
			formatted.push(format);
			combined.push(format)
		}
		fs.writeFileSync(outputDir+file, formatted.join("\r\n"), "utf8");
		console.log(`\t[${num.toString().padStart(2, "0")}] ${name}`)
	}

	fs.writeFileSync(outputDir+"combined.txt", combined.join("\r\n"));
	console.log(`Generated ${outputDir}combined.txt`);
});