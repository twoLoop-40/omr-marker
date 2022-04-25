const fs = require('fs').promises
const path = require('path')

console.log(typeof fs)
fs.readFile('./hello.txt', 'utf8').then((content: string)  => console.log(content))