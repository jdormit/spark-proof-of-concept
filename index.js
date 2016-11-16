var fs = require('fs');
var http = require('http');
var socketIO = require('socket.io');
var express = require('express');
var Remington = require('remington');

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

var writer = new Remington(null, fileText);

io.on('connection', function(socket) {
    // Another problem with the buffer abstraction:
    // on the server, the buffer needs to be a string,
    // not an array of rows
    socket.emit('fileText', writer.getBufferText());

    socket.on('input', function(inputBuffer) {
        inputBuffer.forEach(function(input) {
            writer.setCursor(input.cursor.col, input.cursor.row);
            writer.sendInput(input.value);
        });
        socket.broadcast.emit('input', inputBuffer);
    });

    // This probably won't scale
    socket.on('save', function() {
        fs.writeFileSync(filename, writer.getBufferText());
    });
});

app.use(express.static(__dirname + '/dist'));

app.use('*', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

server.listen(8080);
