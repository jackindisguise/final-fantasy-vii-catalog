function process(data){
	let lines = data.split("\r\n");
	let englishLines = [];
	let japaneseLines = [];
	for(let line of lines){
		let split = line.split("\t");
		let english = split[0];
		let japanese = split[1];
		if(english.toUpperCase() === japanese.toUpperCase()) continue // ignore codes
//		if(names.indexOf(source.toUpperCase()) !== -1 || names.indexOf(target) !== -1) continue;
//		console.log(`Ignoring speaker line: ${source}\t${target}`)
		englishLines.push(english);
		japaneseLines.push(japanese);
	}

	let englishLinesRaster = englishLines.join("\r\n");
	// automatically close open dialogue when it comes upon another open dialogue
	englishLinesRaster = englishLinesRaster.replace(/“([^“”]+)(?=\r\n“)/g, function(a,b){ return `${b.replace(/\r\n/g, " ")}` });
	// collapse linebreaks in open dialogue
	englishLinesRaster = englishLinesRaster.replace(/“([^”]+)”/g, function(a,b){ return `${b.replace(/\r\n/g, " ")}`; });
	// removes double linebreaks
	englishLinesRaster = englishLinesRaster.replace(/(?:\r\n){2,}/g, function(){ return "\r\n"; });
	// remove trailing linebreaks
	englishLinesRaster = englishLinesRaster.replace(/\r\n$/g, "");

	let japaneseLinesRaster = japaneseLines.join("\r\n");
	// automatically close open dialogue when it comes upon another open dialogue
	japaneseLinesRaster = japaneseLinesRaster.replace(/「([^「」]+)(?=\r\n「)/g, function(a,b){ return `${b.replace(/\r\n/g, " ")}`;});
	// collapse linebreaks in open dialogue
	japaneseLinesRaster = japaneseLinesRaster.replace(/「([^」]+)」/g, function(a,b){ return `${b.replace(/\r\n/g, "")}`; });
	// removes double linebreaks
	japaneseLinesRaster = japaneseLinesRaster.replace(/(?:\r\n){2,}/g, function(a){ return "\r\n"; });
	// remove trailing linebreak
	japaneseLinesRaster = japaneseLinesRaster.replace(/\r\n$/g, "");

	englishLines = englishLinesRaster.split("\r\n");
	japaneseLines = japaneseLinesRaster.split("\r\n");

	let processed = [];
	for(let i=0;i<englishLines.length;i++){ processed.push({source:englishLines[i], target:japaneseLines[i]}); }
	return processed;
};

module.exports = process;