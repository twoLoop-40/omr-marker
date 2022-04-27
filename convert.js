"use strict";
exports.__esModule = true;
var fs = require("fs/promises");
var path = require("path");
var shell = require("shelljs");
var fileName = process.argv[2];
function makeJsFileSrc() {
    var getPath = function (fileName) {
        return path.join('./src', fileName);
    };
    var tsName = getPath(fileName);
    shell.exec("tsc ".concat(tsName));
    var jsName = extChange(tsName, 'js');
    return fs.readFile(jsName, 'utf8');
}
function extChange(fileName, ext) {
    var _a = [path.dirname(fileName), path.basename(fileName, 'ts')], dirName = _a[0], baseName = _a[1];
    return path.join(dirName, baseName + "".concat(ext));
}
function makeHtmlFile(jsSource, fileName) {
    var attatchWords = function (src, item) {
        return item[0] + '\n' + src + '\n' + item[1];
    };
    var sendSource = function (src, destination) {
        var longName = extChange(path.join(destination, fileName), 'html');
        fs.writeFile(longName, src)
            .then(function () { return console.log('HTML made!'); })
            .then(function () { return fs.unlink(extChange(path.join('./src', fileName), 'js')); })
            .then(function () { return console.log('js file deleted'); })["catch"](function (err) { return console.error(err); });
    };
    jsSource.then(function (source) { return attatchWords(source, ['<script>', '</script>']); })
        .then(function (source) { return sendSource(source, './dist'); });
}
function makeHtml() {
    var jsSrc = makeJsFileSrc();
    makeHtmlFile(jsSrc, fileName);
}
makeHtml();
