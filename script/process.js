const fs = require("fs");
let sourceLines = [];
let targetLines = [];
let parsedLines = [];
fs.readFile("formatted.txt", "utf8", function(err, data){
	let lines = data.split("\r\n");
	for(let line of lines){
		let split = line.split("\t");
		let source = split[0];
		let target = split[1];
		sourceLines.push(source);
		targetLines.push(target);
	}

	let sourceLinesRaster = sourceLines.join("\r\n");
	// automatically close open dialogue when it comes upon another open dialogue
	sourceLinesRaster = sourceLinesRaster.replace(/“([^”]*)\r\n“/g, function(a,b){ return `${b.replace(/\r\n/g, " ")}\r\n“`; });
	// collapse linebreaks in open dialogue
	sourceLinesRaster = sourceLinesRaster.replace(/“([^”]*)”/g, function(a,b){ return `${b.replace(/\r\n/g, " ")}`; });
	// removes double linebreaks
	sourceLinesRaster = sourceLinesRaster.replace(/(?:\r\n){2,}/g, function(){ return "\r\n"; });

	let targetLinesRaster = targetLines.join("\r\n");
	// automatically close open dialogue when it comes upon another open dialogue
	targetLinesRaster = targetLinesRaster.replace(/「([^」]*)\r\n「/g, function(a,b){ return `${b.replace(/\r\n/g, "")}\r\n「`; });
	// collapse linebreaks in open dialogue
	targetLinesRaster = targetLinesRaster.replace(/「([^」]*)」/g, function(a,b){ return `${b.replace(/\r\n/g, "")}`; });
	// removes double linebreaks
	targetLinesRaster = targetLinesRaster.replace(/(?:\r\n){2,}/g, function(a){ return "\r\n"; });

	sourceLines = sourceLinesRaster.split("\r\n");
	targetLines = targetLinesRaster.split("\r\n");

	let formatted = [];
	for(i=0;i<sourceLines.length;i++) formatted.push(`${sourceLines[i]}\t${targetLines[i]}`);
	fs.writeFile("processed.txt", formatted.join("\r\n"), "utf8", function(err){ });
});