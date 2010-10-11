require.paths.unshift("vendor/lib")

var sys = require("sys"),
    fs  = require("fs"),
    base64 = require("base64")
    
    
var http = require('http');
var unfuddle = http.createClient(80, 'elc.unfuddle.com');
var auth = "Basic " + base64.encode("dashy" + ':' + "codeSp1");
var request = unfuddle.request('GET', '/api/v1/repositories/435844/changesets.json',{"host":'elc.unfuddle.com',"Authorization":auth});
request.end();
request.on('response', function (response) {
  console.log('STATUS: ' + response.statusCode);
  console.log('HEADERS: ' + JSON.stringify(response.headers));
  response.setEncoding('utf8');
  response.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});