function process(data){
	let lines = data.split("\r\n");
	let sourceLines = [];
	let targetLines = [];
	for(let line of lines){
		let split = line.split("\t");
		let source = split[0];
		let target = split[1];
		sourceLines.push(source);
		targetLines.push(target);
	}

	let sourceLinesRaster = sourceLines.join("\r\n");
	// automatically close open dialogue when it comes upon another open dialogue
	sourceLinesRaster = sourceLinesRaster.replace(/“([^“”]+)(?=\r\n“)/g, function(a,b){ return `${b.replace(/\r\n/g, " ")}` });
	// collapse linebreaks in open dialogue
	sourceLinesRaster = sourceLinesRaster.replace(/“([^”]+)”/g, function(a,b){ return `${b.replace(/\r\n/g, " ")}`; });
	// removes double linebreaks
	sourceLinesRaster = sourceLinesRaster.replace(/(?:\r\n){2,}/g, function(){ return "\r\n"; });
	// remove trailing linebreaks
	sourceLinesRaster = sourceLinesRaster.replace(/\r\n$/g, "");

	let targetLinesRaster = targetLines.join("\r\n");
	// automatically close open dialogue when it comes upon another open dialogue
	targetLinesRaster = targetLinesRaster.replace(/「([^「」]+)(?=\r\n「)/g, function(a,b){ return `${b.replace(/\r\n/g, " ")}`;});
	// collapse linebreaks in open dialogue
	targetLinesRaster = targetLinesRaster.replace(/「([^」]+)」/g, function(a,b){ return `${b.replace(/\r\n/g, "")}`; });
	// removes double linebreaks
	targetLinesRaster = targetLinesRaster.replace(/(?:\r\n){2,}/g, function(a){ return "\r\n"; });
	// remove trailing linebreak
	targetLinesRaster = targetLinesRaster.replace(/\r\n$/g, "");

	sourceLines = sourceLinesRaster.split("\r\n");
	targetLines = targetLinesRaster.split("\r\n");

	let processed = [];
	for(let i=0;i<sourceLines.length;i++){ processed.push({source:sourceLines[i], target:targetLines[i]}); }
	return processed;
};

module.exports = process;