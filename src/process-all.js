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
let allLines = [];

console.log("Processing all scene files.");
console.log("");
console.log("File\t\t\t\t  Original Line Count\t  New Line Count\t  Text %");
console.log("----------------------------------------------------------------------------------------------------")
fs.readdir(formatted, function(err, files){
	if(err) return;
	for(let file of files){
		let source = formatted+file;
		if(source.indexOf(".txt") === -1) continue;
		let target = processed+file;
		let data = fs.readFileSync(source, "utf8");
		let original = data.split("\r\n");
		originalLines += original.length;
		let result = process(data);
		let lines = [];
		for(let entry of result) {
			let line = `${entry.source}\t${entry.target}`;
//			if(allLines.contains(line)) continue; // don't add duplicates
//			allLines.push(line);
			lines.push(line);
		}
		newLines += lines.length;
		fs.writeFileSync(target, lines.join("\r\n"), "utf8");
		let width = 31;
		let safe = file;
		safe = safe.length > width ? safe.substring(0,width-3)+"..." : safe.length < width ? safe + " ".repeat(width-safe.length) : safe;
		console.log(`${safe}\t| ${original.length} lines\t\t| ${lines.length} lines\t\t| ${((lines.length / original.length * 100)).toFixed(2)}%`)
	}
	console.log("----------------------------------------------------------------------------------------------------")
	console.log(`\t\t\tTotal:\t  ${originalLines} lines\t\t  ${newLines} lines\t\t  ${(newLines/originalLines*100).toFixed(2)}%`);
});