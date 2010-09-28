var sys = require("sys"),
    fs  = require("fs");
    
var GitHubApi = require("./vendor/node-github/lib/github").GitHubApi;

config = JSON.parse(fs.readFileSync('config.json'));

var Github = {
  get: function(auth, username, repo, branch) {
    var github = new GitHubApi(true);
    github.authenticate(auth.username, auth.token);
    github.getCommitApi().getBranchCommits(username,repo,branch,function(err, commits) {
      for (var key in commits) {
        console.log(commits[key].author.name, commits[key].message);
      }
    });
  }
}

Github.get(config.github, 'jpoz', 'jquery.engineer', 'master');
