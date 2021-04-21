let now = new Date();
const jsdict = require("../jsdict/JSdict.json");
let then = new Date();
console.log(`Loaded JSdict in ${(then-now)/1000} seconds.`);

// fix entities
function __array(data){
	if(Array.isArray(data)) return data;
	if(!data) return [];
	return [data];
}
function lookupExact(word){
	let results = [];
	for(let entry of jsdict.dictionary){
		let r_ele = __array(entry.r_ele);
		let k_ele = __array(entry.k_ele);
		for(let reading of r_ele) if(reading.reb === word) results.push(entry);
		for(let kanji of k_ele) if(kanji.keb === word) results.push(entry);
	}

	return results;
}

function formatSense(word){
	let sense = __array(word.sense);
	let text = [];
	for(let entry of sense){
		let current = [];
		if(entry.pos) current.push(`(${__array(entry.pos).join(", ")})`);
		current.push(`${__array(entry.gloss).join(", ")}`);
		text.push(current.join(" "));
	}

	return text.join("; ");
}

function formatWord(word){
	let display = [];
	let k_ele = __array(word.k_ele);
	let r_ele = __array(word.r_ele);
	if(k_ele) return `${k_ele[0].keb} (${r_ele[0].reb})`;
	else if(r_ele) return `${r_ele[0].reb}`;
}

let x = lookupExact("亡くなる");
for(let result of x){
	console.log(formatWord(result));
	console.log(formatSense(result));
}