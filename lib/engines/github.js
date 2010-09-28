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

var GitHubApi = require("node-github").GitHubApi;

var GitHub = exports.Engine = function(config, db) {
    this.$config = config;
    this.$db  = db;
};

GitHub.prototype.get = function() {
  var self = this;
  var auth = this.$config.auth;
  
  var github = new GitHubApi(true);
  github.authenticate(auth.username, auth.token);
  github.getCommitApi().getBranchCommits(this.$config.username,this.$config.repo,this.$config.branch,function(err, commits) {
    for (var key in commits) {
      var commit = commits[key];
      self.save(commit);
    }
  });
}

GitHub.prototype.global_key = function(key) {
  return "github:" + this.$config.username + ":" + this.$config.repo + ":"+ this.$config.branch + ":" + key
}

GitHub.prototype.info = function() {
  return "Github repo " + this.$config.username + "/" + this.$config.repo + " "+ this.$config.branch
}

GitHub.prototype.save = function(commit) {
  var self = this;  
  var client = self.$db.createClient();
  client.sadd(self.global_key("commits"), commit.id, function (err, val) {
      if (val == 1) self.$db.addEvent({
        title: "Commit to " + self.$config.username + "/" + self.$config.repo + " on " + self.$config.branch,
        subtitle: commit.message,
        actor: commit.author.name,
        link_1_url: commit.url,
        link_1_title: "Commit"
      })
      client.close();
  });
}