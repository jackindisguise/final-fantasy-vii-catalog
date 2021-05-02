

const fs = require("fs");
const http = require("http");

// local includes
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

function lookup(word, spec){
	let varHira = kata2hira(word);
	let varKata = hira2kata(word);
	//console.log(word, varHira, varKata);
	let results = [];
	for(let entry of jsdict.dictionary){
		let r_ele = __array(entry.r_ele);
		let k_ele = __array(entry.k_ele);
		let hasEntry = false;
		for(let reading of r_ele) if(reading.reb === word || reading.reb === varHira || reading.reb === varKata) hasEntry = true;
		for(let kanji of k_ele) if(kanji.keb === word || kanji.keb === varHira || kanji.keb === varKata) hasEntry = true;
		if(!hasEntry) continue;
		results.push(entry);
	}

	sortByPriority(results);
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

module.exports = {lookup:lookup};