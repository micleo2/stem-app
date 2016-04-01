var child_process = require('child_process');
var fs = require('fs');
var server = require('http').createServer(onReq);
var io = require('socket.io')(server);

var getData = [];
var programCode = -1;

var child = child_process.spawn(
  'java', ['-jar', 'NN_runner.jar']
);

server.listen(3000, function(){
	console.log("Listening on port 3000");
});

io.on("connection", function(socket){
	io.emit("catch-up", getData);
  if (programCode !== -1){
    io.emit("program-termination", programCode);
  }
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
	onClose(code);
});

function onReq(req, res){
	console.log("Serving...")
	fs.readFile('index.html',function (err, data){
		res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
		res.write(data);
		res.end();
	});
}

function onClose(code){
  io.emit("program-termination", code);
  programCode = code;
}
