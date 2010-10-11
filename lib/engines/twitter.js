

var TwitterNode = require('twitter-node').TwitterNode

var Twitter = exports.Engine = function(config, db) {
    this.$config = config;
    this.$db  = db;
    var auth = this.$config.auth;

    var twit = new TwitterNode(
      auth;
    );
    
    twit.addListener('error', function(error) {
	  console.log(error.message);
	});
	
	twit
	  .addListener('tweet', function(tweet) {
	    sys.puts("@" + tweet.user.screen_name + ": " + tweet.text);
	  })
	
};

Twitter.prototype.get = function() {
}
