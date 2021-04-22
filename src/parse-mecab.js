const mecab = require("./mecab-wrapper");
const symbols = require("./mecab-symbols");

let words = [];
mecab("ね、CLOUD！ふたりでこっそり遊びにいかない？", function(err,tokens){
	for(let token of tokens){
		console.log(token);
		if(!token.root) continue;
		if(tokenIsNoun(token) && words.indexOf(token.root) === -1) words.push(token.root);
		if(tokenIsVerb(token) && words.indexOf(token.root) === -1) words.push(token.root);
		if(tokenIsAdjective(token) && words.indexOf(token.root) === -1) words.push(token.root);
		if(tokenIsAdverb(token) && words.indexOf(token.root) === -1) words.push(token.root);
	}

	console.log(words);
});

function tokenIsNoun(token){
	return token.pos === symbols.pos.noun;
}

function tokenIsVerb(token){
	return token.pos === symbols.pos.verb;
}

function tokenIsAdjective(token){
	return (token.pos === symbols.pos.i_adj) || (token.pos2 === symbols.pos.na_adj);
}

function tokenIsAdverb(token){
	return token.pos === symbols.pos.adverb;
}