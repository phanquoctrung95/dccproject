//Use to import all created module in this path
var fs        = require("fs");
var path      = require("path");
var Modules = {};

fs
    .readdirSync(__dirname)
    .filter(function(file)
    {
        return ((file.indexOf(".") !== 0) && (file !== "index.js"));
    })
    .forEach(function(file)
    {
        var ModuleName = file.split(".");
        var _module = require(path.join(__dirname, file));
        Modules[ModuleName[0]] = _module;
    });

module.exports = Modules;
