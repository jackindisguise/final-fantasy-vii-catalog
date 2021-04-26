// node packages
const fs = require("fs");

// npm packages
const express = require("express");
const cookie = require("cookie-parser");
const path = require("path");
const bodyParser = require('body-parser');
const session = require("express-session")({
	secret: "kickEEwinTI",
    resave: true,
    saveUninitialized: false
});

// initialize app
var app = express();
app.use(session);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'www/public')));
app.use(cookie());
app.set("view engine", "pug");
app.set("views", "./www/pug/page");

// vocab stuff
const inputFolder = "../vocabulary/unprocessed/";
const outputFolder = "../vocabulary/processed/";

// catch all GET requests
app.get('*', function(req, res, next) {
	console.log(req.socket.address(), req.method, req.url);
	next();
});

app.get("/", function(req, res) {
	res.redirect("/index");
});

// show list of disambiguator files
app.get("/index", function(req, res) {
	fs.readdir(inputFolder, function(err, files){
		let safe = [];
		for(let file of files){
			if(file.indexOf(".json") === -1) continue;
			//console.log(file.indexOf(".json"), file);
			let name = file.substring(0, file.length-5);
			let scene = file.substring(0,2);
			safe.push({name: name, scene:scene});
		}

		res.render('index', {files:safe});
	});
});

app.get("/disambiguate/:scene", function(req,res){
	let scene = req.params.scene;
	fs.readdir(inputFolder, function(err, files){
		for(let file of files){
			let _scene = file.substring(0,2);
			if(scene === _scene){
				fs.readFile(inputFolder+file, function(err, data){
					let json = JSON.parse(data);
					res.render("disambiguate", {scene:scene, lines:json});
				});	
				return;
			}
		}
	});
});

app.post("/disambiguated/:scene", function(req,res){
	let scene = req.params.scene
	let body = req.body;
	let smart = []
	for(let line in body){
		let num = new Number(body[line]);
		smart.push(num);
	}

	fs.readdir(inputFolder, function(err, files){
		for(let file of files){
			let _scene = file.substring(0,2);
			if(scene === _scene){
				fs.readFile(inputFolder+file, function(err, data){
					let json = JSON.parse(data);
					let readable = [];
					for(let i=0;i<json.length;i++){
						if(smart[i] === -1) continue; // remove unnecessary lines
						let line = json[i];
						let chosenDefNum = smart[i];
						let chosenDef = line.definitions[smart[i]];
						delete line.definitions;
						line.definition = chosenDef;
						readable.push(`${line.word}\t${line.root}\t${chosenDef}\t${line.english}\t${line.japanese}`);
					}

					fs.writeFileSync(outputFolder+file, readable.join("\r\n"), "utf8");
					res.redirect("/index");
				});	
				return;
			}
		}
	});
});

// 404
app.get("/*", function(req, res) {
	res.render("error", {page:req.params[0]});
});

// catch all POST requests
app.post('*', function(req, res, next) {
//	console.log(req.socket.address(), req.method, req.url);
//	console.log(req.body);
	next();
});

// start listening on socket.io
var server = app.listen(80, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log("listening at http://%s:%s", host, port);
});