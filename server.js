var child_process = require('child_process');
var fs = require('fs');
var server = require('http').createServer(onReq);
var io = require('socket.io')(server);

var getData = [];

var child = child_process.spawn(
  'java', ['-jar', 'NN_runner.jar']
);

server.listen(3000, function(){
	console.log("Listening on port 3000");
});

io.on("connection", function(socket){
	io.emit("catch-up", getData);
});

child.stdout.on('data', function(data) {
	var strData = data + "";
	if (strData == "\n" || strData == "\t"){
		return;
	}
	getData.push(strData);
	io.emit("program-update", strData);
}); 

child.on("close", function(code){
	io.emit("program-termination", code);
});

function onReq(req, res){
	console.log("Serving...")
	fs.readFile('index.html',function (err, data){
		res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
		res.write(data);
		res.end();
	});
}