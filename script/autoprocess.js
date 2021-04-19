const fs = require("fs");
const process = require("./process");

// local consts
const formatted = "../scene/formatted/";
const processed = "../scene/processed/";

// read all formatted texts and process them
fs.readdir(formatted, function(err, files){
	if(err) return;
	for(let file of files){
		let source = formatted+file;
		if(source.indexOf(".txt") === -1) continue;
		let target = processed+file;
		let data = fs.readFileSync(source, "utf8");
		let result = process(data);
		let lines = [];
		for(let entry of result) lines.push(`${entry.source}\t${entry.target}`);
		fs.writeFileSync(target, lines.join("\r\n"), "utf8");
	}
});