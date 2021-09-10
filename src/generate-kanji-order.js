// node packages
const fs = require("fs");

// local includes
const kanji = require("./kanji");
const directory = "../kanji/";

// program settings
let verbose = true;

// parse arguments
for(let argument of process.argv){
	if(argument === "-q") verbose = false;
	else if(argument === "-v") verbose = true;
}

// generate kanji in order of appearance
{
	let data = [];
	kanji.table.forEach(function(value, index){ data.push(value.kanji); });
	fs.writeFileSync(directory+"appearance.txt", data.join(""), "utf8");
	console.log(`Generated ${directory}appearance.txt`);
}

{
	let data = [];
	let sorted = kanji.table.concat().sort(function(a,b){ return b.occurrences - a.occurrences; });
	sorted.forEach(function(value, index){ data.push(value.kanji); });
	fs.writeFileSync(directory+"occurrences.txt", data.join(""), "utf8");
	console.log(`Generated ${directory}occurrences.txt`);
}