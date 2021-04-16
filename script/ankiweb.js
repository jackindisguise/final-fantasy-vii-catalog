const fs = require("fs");
let data = fs.readFileSync("../CHANGELOG.md", "utf8");

// latest version
let start = data.indexOf("###");
data = data.substring(start);

// previous version
let next = data.indexOf("\n\n### \[", 5);
console.log(next);
data = data.substring(1, next);
console.log(data);

// fix linebreaks
data = data.replace(/\r/g, "");
data = data.replace(/\n+/g, "\n");

// parse 1 line lists
data = data.replace(/(?<=### .+\n)\*+ (.*?)(?=\n###|$)/g, function(a,b){
	return `<ul>\n<li>${b}</li>\n</ul>`;
});	

// parse beginnings of lists
data = data.replace(/(?<=### .+\n)\* (.+)/g, function(a,b){
	return `<ul>\n<li>${b}</li>`;
});	

// parse ends of lists
data = data.replace(/\* (.+)(?=\n+###|$)/g, function(a,b){
	console.log(a);
	return `<li>${b}</li>\n</ul>\n`;
});

// parse ends of lists
data = data.replace(/(?<=\n)\* (.+)/g, function(a,b){
	return `<li>${b}</li>`;
});

// parse links
data = data.replace(/\[(.*?)\]\((.*?)\)/g, function(a,b,c){
	return `<a href="${c}">${b}</a>`;
});

// parse headers
data = data.replace(/(\n)?#+ (.+)/g, function(a,b,c){
	return `${b ? "\n<br/>\n" : ""}<b>${c}</b>`;
});

// parse bolds/italics
data = data.replace(/\*\*\*(.*?)\*\*\*/g, function(a,b){ return `<b><i>${b}</i></b>`; });
data = data.replace(/\*\*(.*?)\*\*/g, function(a,b){ return `<b>${b}</b>`; });
data = data.replace(/\*(.*?)\*/g, function(a,b){ return `<i>${b}</i>`; });

// remove all linebreaks
data = data.replace(/\n/g, "");

fs.writeFileSync("ankiweb.CHANGELOG.html", data, "utf8");