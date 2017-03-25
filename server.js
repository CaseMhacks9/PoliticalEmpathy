var app = require('express')();
var http = require('http').createServer(app);
var sio = require('socket.io');
var io = sio(http);

var port = process.env.PORT || 8080;
http.listen(port);


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});


io.on("connection", function(socket){
	console.log("connection");
	socket.on('disconnect', function(){
    	console.log('disconnection rip');
  	});
});



io.on('connection', function(socket){
  
});

