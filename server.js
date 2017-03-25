var bodyparser = require('body-parser');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var sio = require('socket.io');
var io = sio(http);

var port = process.env.PORT || 8080;

//Anna added
var fs = require("fs");
var file = process.env.ClOUD_DIR + "/" + "db1.db";
var exists = fs.existsSync(file);

if (!exists) {
  console.log ("Creating DB file.")
  fs.openSync(file, "w");
}

var sqlite3 = require ("sqlite3").verbose();
var db = new sqlite3.Database(file);
// end


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

//Anna added
db.serialize ( function() { //creating a table and inserting data into it
  if (! exist) {
    db.run ("CREATE TABLE users (first TEXT, last TEXT, age INTEGER, state TEXT, vote TEXT)")
  }

  var data = db.prepare("INSERT INTO users (TEXT, TEXT, INTEGER, TEXT, TEXT) VALUES (?)") //TO-DO

  //Come up with a way to insert data
  var rnd;
  for (var i = 0; i < 10; i++) {
    rnd = Math.floor(Math.random() * 10000000);
    data.run ("Thing #" + rnd);
  }

data.finalize();
  db.each("SELECT rowid AS is, thing FROM Stuff", function (err.row){
    console.lot(row.id + ": " + row.thing);
  });
});

db.close();
//Anna end

io.on("connection", function(socket){
	console.log("connection");
	socket.on('disconnect', function(){
    	console.log('disconnection rip');
  	});
});



io.on('connection', function(socket){

});
