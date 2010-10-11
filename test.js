require.paths.unshift("vendor/lib")

var sys = require("sys"),
    d  = require("datejs");
    
var s = '2010-07-25T02:04:24-7:00'


var u = Date.parse(sanitizeDate(s));

console.log(new Date(u));

