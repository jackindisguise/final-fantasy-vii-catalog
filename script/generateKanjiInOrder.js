// node packages
const fs = require("fs");

// local includes
const kanji = require("./kanjiTable");
const directory = "../text/kanji/";

// generate kanji in order of appearance
{
	let data = [];
	kanji.table.forEach(function(value, index){ data.push(value.kanji); });
	fs.writeFileSync(directory+"appearance.txt", data.join(""), "utf8");
}
console.log("Generated kanji list sorted by appearance.")

{
	let data = [];
	let sorted = kanji.table.concat().sort(function(a,b){ return b.occurrences - a.occurrences; });
	sorted.forEach(function(value, index){ data.push(value.kanji); });
	fs.writeFileSync(directory+"occurences.txt", data.join(""), "utf8");
}

console.log("Generated kanji list sorted by occurrences.")