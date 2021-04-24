const fs = require("fs");
const http = require("http");

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

async function lookupSync(query){
	let result;
	await _async_get(query, function(data){ result = data; });
	return result;
}

module.exports = {lookupSync:lookupSync};