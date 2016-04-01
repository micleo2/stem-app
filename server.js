var child_process = require('child_process');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var getData = [];

var child = child_process.spawn(
  'java', ['-jar', 'NN_runner.jar']
);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on("connection", function(socket){
	io.emit("catch-up", getData);
});

child.stdout.on('data', function(data) {
	getData.push(data + "");
	io.emit("program-update", data + "");
}); 

child.on("close", function(code){
	io.emit("program-termination", code);
});