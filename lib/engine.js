var sys = require('sys');

$REDIS_URL  = process.env.REDISTOGO_URL || 'redis://username:password@localhost:6379';
$REDIS_INFO = /redis:\/\/([^:]+):([^@]+)@([^:]+):(\d+)/.exec($REDIS_URL);

$REDIS = require("redis-client")

$DB = {
  createClient: function() {
    var client = $REDIS.createClient($REDIS_INFO[4], $REDIS_INFO[3]);
    client.auth($REDIS_INFO[2]);
    return client;
  },
  addEvent: function(event) {
    var client = this.createClient();
    var jsons  = JSON.stringify(event);
    client.rpush("dashy:events", jsons, function(err, v) {
      console.log('New Event: ', jsons);
      client.close();
    })
  },
  incr_score: function(key, player, incr) {
    var client = this.createClient();
    client.sadd("dashy:scores", key, function(err, data) {
      client.zincrby("dashy:score:"+key, incr, player, function () { client.close(); });
    })
  }
}

$ENGINES = {
  list: [],
  current_engine: 0,
  timeout: 3000,
  init: function() {
    for (var key in $DASHY_CONFIG.engines) {
      var engine_constructor = require('./engines/'+key).Engine;
      for (var i in $DASHY_CONFIG.engines[key]) {
        var instance = new engine_constructor($DASHY_CONFIG.engines[key][i], $DB)
        $ENGINES.list.push(instance);
      }
    }
    console.log( $ENGINES.list.length + " engine(s) started");
  },
  run: function() {
    var engine = $ENGINES.list[$ENGINES.current_engine];
    console.log("Running", engine.info());
    engine.get();
    ++$ENGINES.current_engine;
    if ($ENGINES.current_engine >= $ENGINES.list.length) $ENGINES.current_engine = 0;
    setTimeout(function() { $ENGINES.run(); }, $ENGINES.timeout);
  }
};

$ENGINES.init();

$ENGINES.run();