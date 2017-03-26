/**
* Variable decleration
*/

var bodyparser = require('body-parser');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var port = process.env.PORT || 8080; //runs on heroku or localhost:8080
var sqlite3 = require('sqlite3').verbose(); //variables for databases
var db = new sqlite3.Database('mydb.db');
var check;

//listen for port
http.listen(port);

app.use(bodyparser.urlencoded({  //for reading forms
    extended: true
}));
app.use(bodyparser.json());


app.post("/done", function (req, res) { //process form submission: req.body contains form data

/*
*Sending information that is filled out in the form into the database
*/
    // intergrating databases
    db.serialize(function() {
      var first = req.param('firstname'); // database columns
      var last = req.param('lastname');
      var email = req.param('email');
      var age = req.param('age');
      var state = req.param('state');
      var candidate = req.param('vote');
      var cabort = req.param('_abortion');
      var abort = req.param('abortion');
      var cgov = req.param('_govsize');
      var gov = req.param('govsize');
      var cgun = req.param('_guncontrol');
      var gun = req.param ('guncontrol');
      var cwarm = req.param ('_gwarming');
      var warm = req.param ('gwarming');
      var cwage = req.param ('_minwage');
      var wage = req.param ('minwage');
      var cbord = req.param ('_borders');
      var bord = req.param ('borders');
      var clgbt = req.param ('_lgbt');
      var lgbt = req.param ('lgbt');
      var cedu = req.param ('_edu');
      var edu = req.param ('edu');
      var cadmin = req.param ('_admin');
      var admin = req.param ('admin');
      var paired;

      db.run("CREATE TABLE if not exists user_info (id INTEGER primary key, first TEXT, last TEXT, email TEXT, age INTEGER, state TEXT, candidate TEXT, cabort TEXT, abort INTEGER, cgov TEXT, gov INTEGER, cgun TEXT, gun INTEGER, cwarm TEXT, warm INTEGER, cwage TEXT, wage TEXT, cbord TEXT, bord INTEGER, clgbt TEXT, lgbt INTEGER, cedu TEXT, edu INTEGER, cadmin TEXT, admin INTEGER, paired INTEGER)");
      var stmt = db.prepare("INSERT INTO user_info (first, last, email, age, state, candidate, cabort, abort, cgov, gov, cgun, gun, cwarm, warm, cwage, wage, cbord, bord, clgbt, lgbt, cedu, edu, cadmin, admin, paired) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)");
      stmt.run([first, last, email, age, state, candidate, cabort, abort, cgov, gov, cgun, gun, cwarm, warm, cwage, cbord, bord, clgbt, lgbt, cedu, edu, cadmin, admin, paired]);
      stmt.finalize();
      db.each ("SELECT * FROM user_info WHERE paired = 0", function (err, row){
        console.log(row);
        var people = row;
      });
    });
    res.sendFile(__dirname + '/index.html'); //sends user back to index upon completion of the form
});

var match = function(sub1, sub2){
  var value = (sub1.cabort+sub2.cabort)*Math.abs(sub1.abort-sub2.abort)+
        (sub1.cgov+sub2.cgov)*Math.abs(sub1.gov-sub2.gov)+
        (sub1.cgun+sub2.cgun)*Math.abs(sub1.gun-sub2.gun)+
        (sub1.cwarm+sub2.cwarm)*Math.abs(sub1.warm-sub2.warm)+
        (sub1.cwage+sub2.cwage)*Math.abs(sub1.wage-sub2.wage)+
        (sub1.cbord+sub2.cbord)*Math.abs(sub1.bord-sub2.bord)+
        (sub1.clgbt+sub2.clgbt)*Math.abs(sub1.lgbt-sub2.lgbt)+
        (sub1.cedu+sub2.cedu)*Math.abs(sub1.edu-sub2.edu)+
        (sub1.cadmin+sub2.cadmin)*Math.abs(sub1.admin-sub2.admin);
  value = value/9;
  if(value>55){
    ////////////////pair sub1.id and sub2.id
  }
};

var pair = function(people){
  for(var i=0; i < people.length-1; i++){
    for(var a=i+1; a < people.length; a++){
      match(people[i], people[a]);
    }
  }
};


// TODO: check if this is even needed
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

/*
// HELP
//query the datase and convert data into an array
db.each ("SELECT * FROM users_info WHERE paired  = 0", function(err, row){})
}
*/
