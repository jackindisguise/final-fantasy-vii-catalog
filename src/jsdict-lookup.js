

const fs = require("fs");
const http = require("http");

// local includes
const symbols = require("./mecab-symbols");
const convert = require("./kana-converter");

// load jsdict
console.log(`Loading JSdict...`);
let now = new Date();
const jsdict = require("../jsdict/JSdict.json");
let then = new Date();
console.log(`Loaded in ${(then-now)/1000} seconds.`);

// quick add contains to arrays
Array.prototype.contains = function(item){
	return this.indexOf(item) !== -1;
}

// turns non-arrays into arrays
function __array(data){
	if(Array.isArray(data)) return data;
	if(!data) return [];
	return [data];
}

// lookup definitions
async function _async_get(query, callback){
	return new Promise(function(resolve){
		http.get(`http://localhost:666/lookup/${encodeURI(query)}/`, function(res){
			let data = "";
			res.on("data", function(chunk){ data += chunk; });
			res.on("end", function(){ callback(data); resolve(); });
		});
	});
}

function kata2hira(word){
	return word.replace(/(.)/g, function(a,char){
		for(let kana in convert.katakana) if(char == kana) return convert.katakana[kana];
		return char;
	});
}

function hira2kata(word){
	return word.replace(/(.)/g, function(a,char){
		for(let kana in convert.hiragana) if(char == kana) return convert.hiragana[kana];
		return char;
	});
}

function getPOS(entry){
	let senses = __array(entry.sense);
	let pos = [];
	for(let sense of senses){
		if(!sense.pos) continue;
		let _pos = __array(sense.pos);
		for(let entry of _pos) if(!pos.contains(entry)) pos.push(entry);
	}

	return pos;
}

const nounPOS = ["n","suf","n-pr","n-adv","n-suf","n-pref","n-t","adj-na","adj-no","adj-pn","adj-t","adj-f","pn","vs"];
const verbPOS = [
	"v1","v1-s","v2a-s","v4h","v4r","v5aru","v5b","v5g","v5k","v5k-s","v5m","v5n","v5r","v5r-i","v5s",
	"v5t","v5u","v5u-s","v5uru","vz","vi","vk","vn","vr","vs","vs-c","vs-s","vs-i","aux-v","iv","vt","vi",
	"v-unspec","v4k","v4g","v4s","v4t","v4n","v4b","v4m","v2k-k","v2g-k","v2t-k","v2d-k","v2h-k","v2b-k",
	"v2m-k","v2y-k","v2r-k","v2k-s","v2g-s","v2s-s","v2z-s","v2t-s","v2d-s","v2n-s","v2h-s","v2b-s","v2m-s",
	"v2y-s","v2r-s","v2w-s"
];

async function lookupSync(query){
	let result;
	await _async_get(query, function(data){ result = data; });
	return result;
}

function lookup(word, spec){
	let varHira = kata2hira(word);
	let varKata = hira2kata(word);
	console.log(word, varHira, varKata);
	let results = [];
	for(let entry of jsdict.dictionary){
		let r_ele = __array(entry.r_ele);
		let k_ele = __array(entry.k_ele);
		let hasEntry = false;
		for(let reading of r_ele) if(reading.reb === word || reading.reb === varHira || reading.reb === varKata) hasEntry = true;
		for(let kanji of k_ele) if(kanji.keb === word || kanji.keb === varHira || kanji.keb === varKata) hasEntry = true;
		if(!hasEntry) continue;
		let entryPOS = getPOS(entry);
		if(spec === symbols.pos.noun){
			let isNoun = false;
			for(let npos of nounPOS) {
				if(entryPOS.contains(npos)) {
					isNoun = true;
					break;
				}
			}
			if(!isNoun) continue; // not a noun
		} else if(spec === symbols.pos.verb){
			let isVerb = false;
			for(let vpos of verbPOS) {
				if(entryPOS.contains(vpos)){
					isVerb = true;
					break;
				}
			}
			if(!isVerb) continue; // not a verb
		} else if(spec === symbols.pos.i_adj){
			if(!entryPOS.contains("i-adj")) continue; // not an i-adjective
		} else if(spec === symbols.pos2.na_adj){
			if(!entryPOS.contains("na-adj")) continue; // not a na-adjective
		} else if(spec === symbols.pos.adverb){
			if(!entryPOS.contains("adv")) continue; // not an adverb
		}

		results.push(entry);
	}

	return results;
}

function sortByPriority(results){
	results.sort(function(a,b){
		return getWeight(b) - getWeight(a);
	});
}

function getWeight(entry){
	let r_ele = __array(entry.r_ele);
	let k_ele = __array(entry.k_ele);
	let score = 0;
	for(let _r_ele of r_ele) {
		for(let tag of __array(_r_ele.re_pri)){
			switch(tag){
				case "ichi1": score += 100; break;
				case "news1": score += 50; break;
				case "nf1": score += 50;
				case "ichi2": score += 50; break;
				case "ichi3": score += 25; break;
			}
		}
	}
	
	for(let _k_ele of k_ele) {
		for(let tag of __array(_k_ele.ke_pri)){
			switch(tag){
				case "ichi1": score += 100; break;
				case "news1": score += 50; break;
				case "nf1": score += 50;
				case "ichi2": score += 50; break;
				case "ichi3": score += 25; break;
			}
		}
	}

	return score;
}

module.exports = {lookup:lookup, lookupSync:lookupSync};