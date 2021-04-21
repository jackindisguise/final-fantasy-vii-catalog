// node packages
const fs = require("fs");

// local consts
const inputFolder = "../scene/processed/";
const outputFolder = "../scene/tabulated/";

// read all processed texts and scrape kanji data
console.log(`Generating tables for scenes:`);
fs.readdir(inputFolder, function(err, files){
	if(err) return;
	for(let file of files){
		if(file.indexOf(".txt") === -1) continue;
		let table = [];
		table.push("| ID | English | Japanese |");
		table.push("|-|-|-|");		
		let name = file.substring(0, file.length-4);
		let data = fs.readFileSync(inputFolder+file, "utf8");
		let lines = data.split("\r\n");
		for(let i=0;i<lines.length;i++){
			let line = lines[i];
			let split = line.split("\t");
			let source = split[0];
			let target = split[1];
			table.push(`| ${i} | ${source} | ${target} |`);
		}

		fs.writeFileSync(outputFolder+file, table.join("\r\n"), "utf8");
		console.log(`\t${file}`)
	}
});