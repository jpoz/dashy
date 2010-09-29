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
      if (val == 1) {
        self.$db.addEvent({
          title: "Commit to " + self.$config.username + "/" + self.$config.repo + " on " + self.$config.branch,
          subtitle: commit.message,
          actor: commit.author.name,
          link_1_url: commit.url,
          link_1_title: "Commit"
        });
        self.parse(commit);
      } 
      
      client.close();
  });
}

GitHub.prototype.parse = function(commit) {
  var self = this;
  var auth = this.$config.auth;
  
  var github = new GitHubApi(true);
  github.authenticate(auth.username, auth.token);
  github.getCommitApi().showCommit(this.$config.username,this.$config.repo,commit.id,function(err, commit_info) {
    self._parse_line_changes(commit_info);
  });
}

GitHub.prototype._parse_line_changes = function(commit_info) {
  var user_key = (commit_info.author.login || commit_info.author.name || commit_info.author.email);
  if (!$DASHY_CONFIG.users[user_key]) return;
  
  var modified = commit_info.modified;
  var total_lines_added   = 0;
  var total_lines_removed = 0;
  for (var key in modified) {
    if (modified[key].diff) {
      var diff = modified[key].diff.toString();
      var removed_lines = (diff.match(/^\-([^\-]*)$/mig) || []).length;
      var added_lines = (diff.match(/^\+([^\+]*)$/mig) || []).length;
      total_lines_added = total_lines_added + added_lines;
      total_lines_removed = total_lines_removed + removed_lines;
    }
  }
  var client = this.$db.createClient();
  
  
  this.$db.incr_score("github:lines:added", user_key, total_lines_added);
  this.$db.incr_score("github:lines:removed", user_key, total_lines_removed);
  this.$db.incr_score("github:files:added", user_key, (commit_info.added || []).length);
  this.$db.incr_score("github:files:removed", user_key, (commit_info.removed || []).length);

}

