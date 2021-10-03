// node includes
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

// convert file name to title
function getTitle(name){
	let split = name.split("-");
	for(let i=0;i<split.length;i++) split[i] = split[i].substring(0,1).toUpperCase() + split[i].substring(1);
	if(split[0] === "Materia" && split[1] !== "Categories") split = [split[1], split[0]];
	return split.join(" ");
}

// generate scene import files
{
	// local consts
	const inputDir = "../scene/processed/";
	const outputDir = "../anki/scene/";
	let kanjiRule = /([\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A])/g;

	// save all lines for combination
	let combined = [];

	console.log("Converting processed scenes to anki imports.");
	let files = fs.readdirSync(inputDir);
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
			let kanjiMatch = japanese.match(kanjiRule);
			let kanji = kanjiMatch ? [...new Set(kanjiMatch)] : [];
			let format = `${japanese}\t${english}\t${kanji.join("")}\tscene_${num.toString().padStart(2, "0")}`;
			formatted.push(format);
			combined.push(format)
		}
		fs.writeFileSync(outputDir+file, formatted.join("\r\n"), "utf8");
		if(verbose) console.log(`\t[${xterm.C.YELLOW}${num.toString().padStart(2, "0")}${xterm.C.RESET}]: ${xterm.C.PINK}${name}${xterm.C.RESET}`);
	}

	fs.writeFileSync(outputDir+"combined.txt", combined.join("\r\n"));
	console.log(`Generated ${outputDir}combined.txt`);
}

console.log("");
// generate scene quality control files
{
	// local consts
	const inputDir = "../anki/scene/";
	const outputDir = "../anki/scene-qc/";
	let kanjiRule = /([\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A])/g;

	// save all lines for combination
	let combined = [];

	console.log("Selecting quality control lines for Anki scene import files.");
	let files = fs.readdirSync(inputDir);
	for(let file of files){
		if(file==="combined.txt") continue; // we don't need to qc the combined file
		if(file.indexOf(".txt") === -1) continue;
		let noext = file.substring(0,file.length-4);
		let num = new Number(noext.substring(0,2));
		let name = noext.substring("00 - ".length);
		let data = fs.readFileSync(inputDir+file, "utf8");

		// split lines
		let lines = data.split("\r\n");
		let chosen = [];
		for(let i=0;i<lines.length;i+=10) { // skip every 10 lines
			let split = lines[i].split("\t");
			let line = new Array(6);
			line[0] = split[0];
			line[1] = split[1];

			if(i>0){
				let previous = lines[i-1].split("\t");
				line[2]=previous[0];
				line[3]=previous[1];
			}

			if(i<lines.length-1){
				let next = lines[i+1].split("\t");
				line[4]=next[0];
				line[5]=next[1];
			}
			chosen.push(line.join("\t"));
		}
		fs.writeFileSync(outputDir+file, chosen.join("\r\n"), "utf8");
		if(verbose) console.log(`\t[${xterm.C.YELLOW}${num.toString().padStart(2, "0")}${xterm.C.RESET}]: ${xterm.C.PINK}${name}${xterm.C.RESET}`);
	}
}

console.log("");
// generate misc. text import files
{
	// local consts
	const inputDir = "../vocabulary/misc/";
	const outputDir = "../anki/misc/";
	let kanjiRule = /([\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A])/g;

	// save all lines for combination
	let combined = [];

	console.log("Converting misc. text to anki imports:");
	let files = fs.readdirSync(inputDir);
	for(let file of files){
		if(file.indexOf(".txt") === -1) continue;
		let noext = file.substring(0,file.length-4);
		let data = fs.readFileSync(inputDir+file, "utf8");

		// split lines
		let lines = data.split("\r\n");
		let formatted = [];
		for(let line of lines) {
			let split = line.split("\t");
			let japanese = split[0];
			let literal = split[2];
			let english = split[3];
			let kanji = japanese.match(kanjiRule) || [];
			let format = `${japanese}\t${english}\t${literal===english?"":literal}\t${kanji.join("")}\t${noext}`;
			formatted.push(format);
			combined.push(format)
		}
		fs.writeFileSync(outputDir+file, formatted.join("\r\n"), "utf8");
		if(verbose) console.log(`\t${xterm.C.PINK}${getTitle(noext)}${xterm.C.RESET}`);
	}

	fs.writeFileSync(outputDir+"combined.txt", combined.join("\r\n"));
	console.log(`Generated ${outputDir}combined.txt`);
}