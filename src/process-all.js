const { exec } = require("child_process");
const fs = require("fs");
const process = require("./process");

// local consts
const formatted = "../scene/formatted/";
const processed = "../scene/processed/";
let kanjiRule = /([\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A])/g;

// read all formatted texts and process them
let originalLines = 0;
let newLines = 0;

// safe array handling
Array.prototype.contains = function(item){
	return this.indexOf(item) !== -1;
}

// all lines get stored here to remove duplicates
let usedJapanese = [];

// save all lines for combination
let combined = [];

console.log("Processing all scene files:");
fs.readdir(formatted, function(err, files){
	if(err) return;
	for(let file of files){
		let source = formatted+file;
		if(source.indexOf(".txt") === -1) continue;
		let noext = file.substring(0,file.length-4);
		let num = new Number(noext.substring(0,2));
		let name = noext.substring("00 - ".length);
		let target = processed+file;
		let data = fs.readFileSync(source, "utf8");

		// compile original lines
		let original = data.split("\r\n");
		originalLines += original.length;

		// process lines
		let result = process(data);
		let lines = [];
		for(let entry of result) {
//			if(!entry || !entry.target || !entry.source) continue; // ignore empty lines
			if(usedJapanese.contains(entry.target)) continue; // don't add duplicate japanese lines
			usedJapanese.push(entry.target); // track japanese lines
			let kanji = entry.target.match(kanjiRule) || [];
			let line = `${entry.source}\t${entry.target}\t${kanji.join("")}\tscene_${num.toString().padStart(2, "0")}`;
			lines.push(line);
			combined.push(line)
		}
		newLines += lines.length;
		fs.writeFileSync(target, lines.join("\r\n"), "utf8");
		console.log(`\t[${num.toString().padStart(2, "0")}] ${name}: ${original.length} lines > ${lines.length} lines (${((lines.length / original.length * 100)).toFixed(2)}% used)`)
	}

	fs.writeFileSync(processed+"combined.txt", combined.join("\r\n"));
	console.log(`Generated ${processed}combined.txt`);
	console.log(`Original Lines: ${originalLines}`);
	console.log(`New Lines: ${newLines} (${(newLines/originalLines*100).toFixed(2)}% used)`);
});