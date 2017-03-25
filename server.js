var bodyparser = require('body-parser');
var express = require('express');
var app = express();
var http = require('http').createServer(app);

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

var port = process.env.PORT || 8080; //runs on heroku or localhost:8080
http.listen(port);

app.use(bodyparser.urlencoded({  //for reading forms
    extended: true
}));
app.use(bodyparser.json());


app.post("/done", function (req, res) { //process form submission: req.body contains form data
    console.log(req.body)
    res.sendFile(__dirname + '/index.html'); //sends user back to index upon completion of the form
});

app.post("/form", function (req, res) { //when user is sent to form, send them form.html
    res.sendFile(__dirname + '/form.html');
});



app.get('/', function(req, res){ //when someone connects initially, send the index
	res.sendFile(__dirname + '/index.html');
});

//when someone connects to /form, send them form.html
app.get('/form', function(req, res){ 
  res.sendFile(__dirname + '/form.html');
});

//Anna added
db.serialize ( function() { //creating a table and inserting data into it
  if (! exist) {
    db.run ("CREATE TABLE users (ID TEXT)");
  }

  var data = db.prepare("INSERT INTO users VALUES (?)") //TO-DO

  //Come up with a way to insert data
  var rnd;
  for (var i = 0; i < 10; i++) {
    rnd = Math.floor(Math.random() * 10000000);
    data.run ("Thing #" + rnd);
  }

data.finalize();
  db.each("SELECT rowid AS is, thing FROM Stuff", function (err, row){
    console.lot(row.id + ": " + row.thing);
  });
});

db.close();
//Anna end