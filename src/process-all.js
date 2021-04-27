const fs = require("fs");
const process = require("./process");

// local consts
const formatted = "../scene/formatted/";
const processed = "../scene/processed/";

// read all formatted texts and process them
let originalLines = 0;
let newLines = 0;

// safe array handling
Array.prototype.contains = function(item){
	return this.indexOf(item) !== -1;
}

// all lines get stored here to remove duplicates
let usedJapanese = [];

console.log("Processing all scene files:");
fs.readdir(formatted, function(err, files){
	if(err) return;
	for(let file of files){
		let source = formatted+file;
		if(source.indexOf(".txt") === -1) continue;
		let name = file.substring(0,file.length-4);
		let target = processed+file;
		let data = fs.readFileSync(source, "utf8");
		let original = data.split("\r\n");
		originalLines += original.length;
		let result = process(data);
		let lines = [];
		for(let entry of result) {
			if(usedJapanese.contains(entry.target)) continue; // don't add duplicate japanese lines
			usedJapanese.push(entry.target); // track japanese lines
			lines.push(`${entry.source}\t${entry.target}`);
		}
		newLines += lines.length;
		fs.writeFileSync(target, lines.join("\r\n"), "utf8");
		console.log(`\t${name}`);
		console.log(`\t\t${original.length} lines > ${lines.length} lines (${((lines.length / original.length * 100)).toFixed(2)}% used)`)
		console.log("");
	}
	console.log(`Original Lines: ${originalLines}`);
	console.log(`New Lines: ${newLines} (${(newLines/originalLines*100).toFixed(2)}% used)`);
});