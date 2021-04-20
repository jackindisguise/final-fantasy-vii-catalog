// node packages
const fs = require("fs");

// local consts
const inputFolder = "../scene/processed/";
const outputFolderEnglish = "../scene/split/english/";
const outputFolderJapanese = "../scene/split/japanese/";
const outputFolderEnglishLines = "../scene/line/english/";
const outputFolderJapaneseLines = "../scene/line/japanese/";

// other
let allSource = [];
let allTarget = [];

// read all processed texts and scrape kanji data
console.log(`Splitting English/Japanese dialogue:`);
fs.readdir(inputFolder, function(err, files){
	if(err) return;
	for(let file of files){
		if(file.indexOf(".txt") === -1) continue;
		let name = file.substring(0, file.length-4);
		let data = fs.readFileSync(inputFolder+file, "utf8");
		let sourceLines = [];
		let targetLines = [];
		let lines = data.split("\r\n");
		for(let i=0;i<lines.length;i++){
			let line = lines[i];
			let split = line.split("\t");
			let source = split[0];
			let target = split[1];
/*			if(!fs.existsSync(`${outputFolderEnglishLines}${name}/`)) fs.mkdirSync(`${outputFolderEnglishLines}${name}/`);
			if(!fs.existsSync(`${outputFolderJapaneseLines}${name}/`)) fs.mkdirSync(`${outputFolderJapaneseLines}${name}/`);
			fs.writeFileSync(`${outputFolderEnglishLines}${name}/${i}.txt`, source, "utf8");
			fs.writeFileSync(`${outputFolderJapaneseLines}${name}/${i}.txt`, target, "utf8");*/
			sourceLines.push(source);
			allSource.push(source);
			targetLines.push(target);
			allTarget.push(target);
		}

		fs.writeFileSync(outputFolderEnglish+file, sourceLines.join("\r\n"), "utf8");
		fs.writeFileSync(outputFolderJapanese+file, targetLines.join("\r\n"), "utf8");
		console.log(`\t${file}`)
	}

	fs.writeFileSync(outputFolderEnglish+"combined.txt", allSource.join("\r\n"), "utf8");
	console.log(`Combined all English dialogue into one file: '${outputFolderEnglish+"combined.txt"}'`)
	fs.writeFileSync(outputFolderJapanese+"combined.txt", allTarget.join("\r\n"), "utf8");
	console.log(`Combined all Japanese dialogue into one file: '${outputFolderJapanese+"combined.txt"}'`)
});