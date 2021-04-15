// node packages
const fs = require("fs");

// local includes
const kanji = require("./kanjiTable");
const directory = "../text/kanji/";

// use table
let kanjiData = [];
for(let entry in kanji.table){
	kanjiData.push({kanji:entry, occurrences:kanji.table[entry]});
}
console.log("Generated kanji table for sorting.");

// generate kanji in order of appearance
{
	let data = [];
	kanjiData.forEach(function(value, index){ data.push(value.kanji); });
	fs.writeFileSync(directory+"appearance.txt", data.join(""), "utf8");
}
console.log("Generated kanji list sorted by appearance.")

{
	let data = [];
	let sorted = kanjiData.concat().sort(function(a,b){ return b.occurrences - a.occurrences; });
	sorted.forEach(function(value, index){ data.push(value.kanji); });
	fs.writeFileSync(directory+"occurences.txt", data.join(""), "utf8");
}

console.log("Generated kanji list sorted by occurrences.")