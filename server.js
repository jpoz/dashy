require.paths.unshift("vendor/lib")

var fs  = require("fs");

$DASHY_CONFIG = JSON.parse(fs.readFileSync('config.json'));

// require express and others to make sure
require("express")
require("connect")
require("jade")
require("sass")

//require data acquisition module
require ("./lib/engine")

//require the actual express app
require ("./lib/app")
