
var sys = require('sys');

var TriMet = exports.Engine = function(config, db) {
    this.$config = config;
    this.$db  = db;
};

TriMet.prototype.info = function() {
  return "Accessing jpoz.net... this may take a while"
}

TriMet.prototype.get = function() {
  var self = this;
  

  var http = require('http');
  var trimet = http.createClient(80, 'streetcar.jpoz.net');
  var request = trimet.request('GET', '/api/t5/n11eve/loven13.json',{host:'streetcar.jpoz.net'});
  request.end();
  request.on('response', function (response) {
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      var times = JSON.parse(chunk);
      console.log(times)
      self.$db.setValueFor("streetcar", times)
    });
  });
}
