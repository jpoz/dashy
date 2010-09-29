var sys = require("sys"),
    fs  = require("fs");
    
diff = fs.readFileSync('test.diff').toString();

var removed_lines = diff.match(/^\-([^\-]*)$/mig).length;
var added_lines = diff.match(/^\+([^\+]*)$/mig).length;

console.log(removed_lines);
console.log(added_lines);
