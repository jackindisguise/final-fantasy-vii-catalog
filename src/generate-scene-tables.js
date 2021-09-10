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
const inputFolder = "../scene/processed/";
const outputFolder = "../scene/tabulated/";

// read all processed texts and scrape kanji data
console.log(`Generating tables for scenes.`);
fs.readdir(inputFolder, function(err, files){
	if(err) return;
	for(let file of files){
		if(file.indexOf(".txt") === -1) continue;
		if(file === "combined.txt") continue;
		let table = [];
		table.push("| ＃ | English | Japanese |");
		table.push("|-|-|-|");		
		let noext = file.substring(0,file.length-4);
		let num = new Number(noext.substring(0,2));
		let name = noext.substring("00 - ".length);
		let data = fs.readFileSync(inputFolder+file, "utf8");
		let lines = data.split("\r\n");
		for(let i=0;i<lines.length;i++){
			let line = lines[i];
			let split = line.split("\t");
			let source = split[0];
			let target = split[1];
			table.push(`| ${i+1} | ${source} | ${target} |`);
		}

		let fixedFile = file.substring(0,file.length-4)+".md";
		fs.writeFileSync(outputFolder+fixedFile, table.join("\r\n"), "utf8");
		if(verbose) console.log(`\t[${xterm.C.YELLOW}${num.toString().padStart(2, "0")}${xterm.C.RESET}]: ${xterm.C.PINK}${name}${xterm.C.RESET}`);
	}
});