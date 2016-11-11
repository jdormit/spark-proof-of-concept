var fs = require('fs');
var http = require('http');
var socketIO = require('socket.io');
var express = require('express');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

var args = process.argv.slice(2);
if (args.length !== 1) {
    console.error("Usage: npm start -- filename");
    process.exit(1);
}
var filename = args[0];
var fileText = fs.readFileSync(filename, {encoding: 'utf8'});

io.on('connection', function(socket) {
    socket.emit('fileText', fileText);
});

app.use(express.static(__dirname + '/dist'));

app.use('*', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

server.listen(8080);
