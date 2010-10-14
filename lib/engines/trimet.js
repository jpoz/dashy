
var sys = require('sys');

var TriMet = exports.Engine = function(config, db) {
    this.$config = config;
    this.$db  = db;
    this.lock = false;
};

TriMet.prototype.info = function() {
  return "Accessing jpoz.net... this may take a while"
}

TriMet.prototype.get = function() {
  var self = this;
  if (!self.lock) {
    self.lock = true;
    var http = require('http');
    var trimet = http.createClient(80, 'streetcar.jpoz.net');
    var request = trimet.request('GET', '/api/t5/n11eve/loven13.json',{host:'streetcar.jpoz.net'});
    request.end();
    request.on('response', function (response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        console.log(chunk)
        var times = JSON.parse(chunk);
        self.$db.setValueFor("streetcar", times)
        self.lock = false;
      });
      response.on("end", function() {
        self.lock = false;
      });
      response.on("error", function(exception) {
        console.log(exception);
      });
    });
  } else {
    console.log("TriMet was locked");
  }

}
