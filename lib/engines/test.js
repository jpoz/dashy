/*

{
  auth {
    username: 'username',
    token: 't0k3n'
  },
  username: 'repousername',
  repo: 'repo',
  branch: 'branch',
}

*/

var TestEngine = exports.Engine = function(config, db) {
    this.$config = config;
    this.$db  = db;
};

TestEngine.prototype.get = function() {
  this.save();
}

TestEngine.prototype.info = function() {
  return "TestEngine " + this.$config
}

TestEngine.prototype.save = function() {
  this.$db.addEvent({
      title: "Test Engine EVENT" + Math.round(Math.random(1)*100),
      subtitle: "Subtitle",
      actor: "ACTOR",
      link_1_url: "http://www.google.com/",
      link_1_title: "Test"
  });
}