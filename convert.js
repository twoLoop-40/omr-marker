var fs = require('fs').promises;
var path = require('path');
console.log(typeof fs);
fs.readFile('./hello.txt', 'utf8').then(function (content) { return console.log(content); });
