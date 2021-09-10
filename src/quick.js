const fs = require("fs");
const processScript = require("./process-script");

fs.readFile("formatted.txt", "utf8", function(err, data){
	let original = data.split("\r\n");
	let result = processScript(data);
	let lines = [];
	for(let entry of result) lines.push(`${entry.source}\t${entry.target}`);
	fs.writeFileSync("./processed.txt", lines.join("\r\n"), "utf8");
	console.log(`formatted.txt: ${original.length} lines > ${lines.length} lines`)
	console.log("saved to processed.txt");
});