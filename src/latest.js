const fs = require("fs");
let data = fs.readFileSync("../CHANGELOG.md", "utf8");

// latest version
let rule = /## \[(.*?)\]\((.*?)\) (.+)/;
let result = rule.exec(data);
let version = result[1];
let link = result[2];
let date = result[3];
console.log(`<b>Latest Version:</b> <b><a href="${link}">${version}</a></b> ${date}`);