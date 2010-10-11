

var TwitterNode = require('twitter-node').TwitterNode

var Twitter = exports.Engine = function(config, db) {
    this.$config = config;
    this.$db  = db;
    var self = this;
    
    var auth = this.$config

    var twit = new TwitterNode(
      auth
    );
    
    twit.addListener('error', function(error) {
	    console.log(error.message);
	  });
	  	
    twit
      .addListener('tweet', function(tweet) {
        self.$db.addEvent({
          title: tweet.text,
          actor: tweet.user.screen_name,
          timestamp: (Date.parse(new Date()))
        });
      })

      .addListener('limit', function(limit) {
        console.log("LIMIT: " + sys.inspect(limit));
      })

      .addListener('delete', function(del) {
        console.log("DELETE: " + sys.inspect(del));
      })

      .addListener('end', function(resp) {
        console.log("wave goodbye... " + resp.statusCode);
      })

      .stream();
	
};

Twitter.prototype.get = function() {
}



Twitter.prototype.info = function() {
  return "Twitter";
}
