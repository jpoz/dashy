/**
 * Module dependencies.
 */

var express = require('express'),
    connect = require('connect'),
    sys = require('sys');

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


app.listen(parseInt(process.env.PORT || 8000), null);
