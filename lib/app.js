/**
 * Module dependencies.
 */

var express = require('express'),
    connect = require('connect'),
    sys = require('sys')

var app = express.createServer(
    express.logger(),
    express.cookieDecoder(),
    express.session()
);

// setup view and public directories
app.set('views', __dirname + '/views');
app.use(express.staticProvider(__dirname + '/../public'));
app.use(express.bodyDecoder());

app

.get('/', function(req, res) {
  res.render('index.ejs');
})

.get('/event/:id', function(req, res) {
  var self = this,
  timer = setInterval(function(){
    var client = $DB.createClient();
    client.llen("dashy:events", function(err, value) {
      if (value > req.params.id) {
        clearInterval(timer)
        client.lrange("dashy:events", req.params.id, value, function(err, data) {
          var list = data.map(function(d) { return d.toString(); })
          res.send({ revision: value, list: list });
          client.close();
        });
      } else {
        client.close();
      }
    });
  }, 100);
})

app.listen(parseInt(process.env.PORT || 8000), null);
