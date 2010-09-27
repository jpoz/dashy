var sys = require("sys"),
    fs  = require("fs");
var GitHubApi = require("./vendor/node-github/lib/github").GitHubApi;

config = JSON.parse(fs.readFileSync('config.json'));

console.log(config);

var github = new GitHubApi(true);
github.authenticate(config.github.username, config.github.token);
// github.getRepoApi().show('jpoz','APNS', function(err, something) {
//   console.log(something);
// });

github.getCommitApi().getBranchCommits('jpoz','APNS','master',function(err, something) {
  console.log(something);
});
