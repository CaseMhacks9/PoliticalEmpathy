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
var nodemailer = require('nodemailer');

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
      stmt.run([first, last, email, age, state, candidate, cabort, abort, cgov, gov, cgun, gun, cwarm, warm, cwage, wage, cbord, bord, clgbt, lgbt, cedu, edu, cadmin, admin, paired]);
      stmt.finalize();
      db.all("SELECT * FROM user_info WHERE paired = 0", function (err, row){
        var people = row;
        pair(people);
      });
    });
    res.sendFile(__dirname + '/index.html'); //sends user back to index upon completion of the form
});


/**
* Matching algorithm
*/
var match = function(sub1, sub2){

  var value = ((sub1.cabort=='on' | 0)+(sub2.cabort=='on' | 0))*Math.abs(sub1.abort-sub2.abort)+
        ((sub1.cgov=='on' | 0)+(sub2.cgov =='on'| 0))*Math.abs(sub1.gov-sub2.gov)+
        ((sub1.cgun=='on' | 0)+(sub2.cgun =='on'| 0))*Math.abs(sub1.gun-sub2.gun)+
        ((sub1.cwarm =='on'|0)+(sub2.cwarm =='on'| 0))*Math.abs(sub1.warm-sub2.warm)+
        ((sub1.cwage =='on'|0)+(sub2.cwage =='on'| 0))*Math.abs(sub1.wage-sub2.wage)+
        ((sub1.cbord =='on'|0)+(sub2.cbord=='on' | 0))*Math.abs(sub1.bord-sub2.bord)+
        ((sub1.clgbt =='on'|0)+(sub2.clgbt =='on'| 0))*Math.abs(sub1.lgbt-sub2.lgbt)+
        ((sub1.cedu =='on'|0)+(sub2.cedu =='on'| 0))*Math.abs(sub1.edu-sub2.edu)+
        ((sub1.cadmin =='on'|0)+(sub2.cadmin =='on'| 0))*Math.abs(sub1.admin-sub2.admin);
  return value/9;

};

//Pairing function
var pair = function(people){
  for(var i=0; i < people.length-1; i++){
    for(var a=i+1; a < people.length; a++){
      var val = match(people[i], people[a]);
      console.log(val);
      if(val>50){
        db.run ("UPDATE user_info SET paired = " + people[i].id + " WHERE id = " + people[a].id + ";");
        db.run ("UPDATE user_info SET paired = " + people[a].id + " WHERE id = " + people[i].id + ";");
        console.log("### "+people[i].first+" paired with "+people[a].first+".");
        people.splice(a,1);
      }

    }
  }
};


// TODO: check if this is even needed
app.post("/form", function (req, res) { //when user is sent to form, send them form.html
    res.sendFile(__dirname + '/form.html');
    db.all("SELECT * FROM user_info WHERE paired = 0", function (err, row){
        var people = row;
        console.log(row);
      });
});

app.get('/', function(req, res){ //when someone connects initially, send the index
	res.sendFile(__dirname + '/index.html');
});

//when someone connects to /form, send them form.html
app.get('/form', function(req, res){
  res.sendFile(__dirname + '/form.html');
});

/**
* Sending the email
*/



var router = express.Router();
app.use('/sayHello', router);
router.post('/', handleSayHello); // handle the route at yourdomain.com/sayHello

function handleSayHello(req, res) {
    // Not the movie transporter!
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'example@gmail.com', // Your email id
            pass: 'password' // Your password
        }
    });
}

var text = 'Hello world from \n\n' + req.body.name;

var mailOptions = {
    from: 'example@gmail.com>', // sender address
    to: 'receiver@destination.com', // list of receivers
    subject: 'Email Example', // Subject line
    text: text //, // plaintext body
    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.response);
        res.json({yo: info.response});
    };
});
