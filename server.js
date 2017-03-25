var bodyparser = require('body-parser');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var sio = require('socket.io');
var io = sio(http);

var port = process.env.PORT || 8080;
http.listen(port);

app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(bodyparser.json());

app.post("/done", function (req, res) {
    console.log(req.body)
    res.sendFile(__dirname + '/index.html');
});

app.post("/form", function (req, res) {
    res.sendFile(__dirname + '/form.html');
});



app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/form', function(req, res){
  res.sendFile(__dirname + '/form.html');
});


io.on("connection", function(socket){
	console.log("connection");
	socket.on('disconnect', function(){
    	console.log('disconnection rip');
  	});
});



io.on('connection', function(socket){
  
});