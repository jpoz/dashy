require.paths.unshift("vendor/lib")

// require express and others to make sure
require("express")
require("connect")
require("jade")
require("sass")

//require the actual express app
require ("./lib/app")