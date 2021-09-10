const fs = require("fs");
const processScript = require("./process-script");

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

// save all lines for combination
let combined = [];

console.log("Processing all scene files.");
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
		let result = processScript(data);
		let lines = [];
		for(let entry of result) {
			if(usedJapanese.contains(entry.target)) continue; // don't add duplicate japanese lines
			usedJapanese.push(entry.target); // track japanese lines
			let line = `${entry.source}\t${entry.target}`;
			lines.push(line);
			combined.push(line)
		}
		newLines += lines.length;
		fs.writeFileSync(target, lines.join("\r\n"), "utf8");
		if(verbose) console.log(`\t[${xterm.C.YELLOW}${num.toString().padStart(2, "0")}${xterm.C.RESET}]: ${xterm.C.PINK}${name}${xterm.C.RESET} (${xterm.C.LIME}${lines.length} / ${original.length} lines${xterm.C.RESET})`);
	}
	console.log(`\t[${xterm.C.YELLOW}**${xterm.C.RESET}]: ${xterm.C.WHITE}${originalLines} lines before formatting.${xterm.C.RESET}`);
	console.log(`\t[${xterm.C.YELLOW}**${xterm.C.RESET}]: ${xterm.C.WHITE}${newLines} lines after formatting.${xterm.C.RESET}`);
	console.log(`\t[${xterm.C.YELLOW}**${xterm.C.RESET}]: ${xterm.C.WHITE}${((1-(newLines/originalLines))*100).toFixed(2)}% of lines crushed under my strong feet.${xterm.C.RESET}`);

	fs.writeFileSync(processed+"combined.txt", combined.join("\r\n"));
	console.log(`Generated ${processed}combined.txt`);
});