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

.get('/test', function(req, res) {
  res.render('test.ejs');
})


.get('/events', function(req, res) {
  var self = this,
  timer = setInterval(function(){
    var client = $DB.createClient();
    client.llen("dashy:events", function(err, value) {
      if (value > req.query.revision) {
        clearInterval(timer)
        client.lrange("dashy:events", req.query.revision, value, function(err, data) {
          var list = data.map(function(d) { return d.toString(); })
          res.contentType("text/javascript");
          res.send((req.query.jsonp || 'jsonp')+"(" + JSON.stringify({ revision: value, list: list }) + ");");
          client.close();
        });
      } else {
        client.close();
      }
    });
  }, 1000);
})

.get('/highscores', function(req, res) {
  var client = $DB.createClient();  
  client.smembers("dashy:scores", function(err, data) {
    client.close();
    for (var i in data) { data[i] = data[i].toString(); } // debuffer data;
    res.send(data);
  });
})

.get('/highscore/:dbkey', function(req, res) {
  var self = this;
  var top  = 10;
  
  var client = $DB.createClient();
  var dbkey  = "dashy:score:"+req.params.dbkey
  
  client.zrevrange(dbkey, 0,top, function(err, data) {
    client.close();
    if (!data) res.send({});
    var results = {rank:[],scores:{}};
    var size   = data.length;
    var count  = 0
    var getresult = function(key) {
      var c = $DB.createClient();
      c.zscore(dbkey, key, function(err, score) {
        results.scores[key] = score;
        ++count;
        if (size == count) res.send(results);
      });
    }
    for (var i in data) {
      var user = data[i].toString();
      results.rank.push(user);
      getresult(user);
    }
  });
})

app.listen(parseInt(process.env.PORT || 8000), null);
