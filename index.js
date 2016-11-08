var fs = require('fs')
var express = require('express');
var app = express();

var args = process.argv.slice(2);
if (args.length !== 1) {
    console.error("Usage: npm start -- filename");
    process.exit(1);
}
var filename = args[0];
var fileText = fs.readFileSync(filename, {encoding: 'utf8'});

app.use(express.static(__dirname + '/dist'));

app.use('*', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

app.listen(8080);
