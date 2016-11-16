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

var cursors = {};

io.on('connection', function(socket) {
    // The client starts with cursor position 0,0
    cursors[socket.id] = {row: 0, col: 0}
    
    // Another problem with the buffer abstraction:
    // on the server, the buffer needs to be a string,
    // not an array of rows
    socket.emit('init', {
        text: writer.getBufferText(),
        id: socket.id
    });
    
    socket.on('input', function(inputBuffer) {
        inputBuffer.forEach(function(input) {
            writer.setCursor(input.cursor.col, input.cursor.row);
            writer.sendInput(input.value);
        });
        // writer.getCursor() now points to the client's current cursor position
        cursors[socket.id] = writer.getCursor();
        socket.broadcast.emit('input', inputBuffer);
        socket.broadcast.emit('cursors', cursors);
    });

    // This probably won't scale
    socket.on('save', function() {
        fs.writeFileSync(filename, writer.getBufferText());
    });

    socket.on('disconnect',  function() {
        delete cursors[socket.id];
        socket.broadcast.emit('cursors', cursors);
    });
});

app.use(express.static(__dirname + '/dist'));

app.use('*', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

server.listen(8080);
