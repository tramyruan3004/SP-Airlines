var express = require("express");
const fileUpload = require('express-fileupload');

var usersDB = require('../model/users')
var airportsDB = require('../model/airports')
var flightsDB = require('../model/flights')
var bookingsDB = require('../model/bookings')
var promotionDB = require('../model/promotion')

const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config.js");
const isLoggedInMiddleware = require("../auth/isLoggedInMiddleware");

var app = express();

var cors = require('cors');
app.options('*',cors());
app.use(cors({origin: "http://localhost:3001"}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(fileUpload());

// User login endpoints --used
app.post("/login/", (req, res) => {
    usersDB.verify(
        req.body.username,
        req.body.password,
        (error, user) => {
            if (error) {
                res.status(500).send("Got error leh!");
                console.log("Got error leh!");
                return;
            } else if (user === null) {
                res.status(401).send("Cannot find user lah!");
                console.log("Cannot find user lah!");
                return;
            } else {
                const payload = { user_id: user.id, username: user.username, role:user.role };
                jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: 900 }, (error, token) => {
                if (error) {
                    console.log(error);
                    res.status(401).send("Cannot do the token leh!");
                console.log("Cannot do the token lah!");

                    return;
                } else {
                    res.status(200).send({
                        token: token,
                        user_id: user.userid,
                        username: user.username,
                        role:user.role
                    });
                }
            });
        }
    });
});


// Endpoint 05 POST /airport --used
app.post('/addAirport/',  function (req, res) {
    var {newAirportName, newAirportCountry, newAirportShortform} = req.body;
    airportsDB.insertAirport(newAirportName, newAirportCountry, newAirportShortform, function (err, result) {
        if (!err) {
            console.log(result.affectedRows);
            res.status(204).send();
        } else{
            if (err.errno == 1062){
                res.status(422).json("Airport already existed!");
            }
            else{
                res.status(500).json({Result:"Internal Error"});
            }
        }
    });
});

// Endpoint 06 GET /airport --used
app.get('/allAirports/',  function (req, res) {
    airportsDB.getAirports( function (err, result) {
        if (!err) {

            res.status(200).send({result});
        }
        else{
            res.status(500).send(error);
        }
    });
});

// Endpoint 08 GET /flightDirect/:originAirportId/:destinationAirportId --used
app.get('/flightDirectOneWay/:originAirportid/:destinationAirportid/:departureDateInput/', function (req, res) {
    var originAirportid = req.params.originAirportid;
    var destinationAirportid = req.params.destinationAirportid;
    var departureDateInput = req.params.departureDateInput;
    flightsDB.getFlightAirportName(originAirportid, destinationAirportid, departureDateInput, function (err, result) {
        if (!err) {
            console.log(result);
            res.status(200).send(result);
        }
        else{
            console.log(error);
            res.status(500).send(error);
        }
    });
});

// Endpoint 07 POST /flight --used
app.post('/addFlight/',  function (req, res) {
    console.log(req.body);
    flightsDB.insertFlight(req.body.newFlightCode, req.body.newFlightAircraft,req.body.originInput, req.body.destinationInput, req.body.newFlightEmbarkDate, req.body.newFlightEmbarkTime, req.body.newFlightArrivedDate, req.body.newFlightArrivedTime, req.body.newFlightTravelTime, req.body.newFlightPrice , function (err, result) {
        if (!err) {
            console.log(result.affectedRows);
            res.status(201).json({"flightid":`${result.insertId}`});
        } else{
            res.status(500).json({Result:"Internal Error"});
        }
    });
});

// Endpoint 01 POST /users --used
app.post('/addNewUser/',  function (req, res) {
    usersDB.insertUser(req.body.username, req.body.email, req.body.contact, req.body.password, req.body.role, function (err, result) {
        if (!err) {
            console.log(result.affectedRows);
            res.status(201).json({"userid":`${result.insertId}`});
        } else{
            if (err.errno == 1062){
                res.status(422).json("User already existed!");
            }
            else{
                res.status(500).json("Some errors occurred");
            }
        }
    });
});

// Endpoint uploading Profile picture --used
app.post('/uploadProfilePic/', function(req, res) {
    console.log("Inside uploadFileBackend")
    let sampleFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
        console.log(req.files)
      return res.status(400).send('No files were uploaded.');
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/profileImg/' + sampleFile.name;
  
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).send(err);
      res.send('File uploaded!');
    });
});

// Endpoint 03 GET /users/:id --used
app.get('/getUser/:id/', function (req, res) {
    var userid = parseInt(req.params.id);
    usersDB.getUser(userid, function (err, result) {
        if (!err) {
            if (result == 0){
                res.status(200).json("No such user exists!");
            }
            else{
                res.status(200).send(result);
            }
        }else{
            res.status(500).json({"Result":"Internal Error"});
        }
    });
});

// Endpoint 04 PUT /users/:id --used
app.put('/editUser/:id/', function (req, res) {
    var userid = parseInt(req.params.id);
    var {username, email, contact, password, role, profile_pic_url} = req.body; //according to table headers
    usersDB.updateUser(username, email, contact, password, role, profile_pic_url, userid, function (err, result) {
        if (!err) {
            if (result.affectedRows == 0){
                res.status(200).json("No such user exists!");
            }
            else{
                res.status(204).send();
            }
        }else{
            if (err.errno == 1062){
                res.status(422).json("User already existed!");
            }
            else{
                res.status(500).json({Result:"Internal Error"});
            }
        }
    });
});
//===============================================================================


// Endpoint 11 GET /transfer/flight/:originAirportId/:destinationAirportId/ --used
app.get('/transfer/flight/:originAirportid/:destinationAirportid/:departureDateInput/', function (req, res) {
    var originAirportid =  req.params.originAirportid;
    var destinationAirportid =  req.params.destinationAirportid;
    var departureDateInput = req.params.departureDateInput;
    if (isNaN(originAirportid) || isNaN(destinationAirportid)){
        res.status(500).json({"Result":"Internal Error"});
        return;
    }
    flightsDB.getTransfer(originAirportid, destinationAirportid, departureDateInput, function (err, result) {
        if (!err) {
            console.log(result);
            if (result[0].firstFlightId == null){
                res.status(200).send("No such transfer flight exists!");
            }
            else{
                res.status(201).send(result);
            }
        }
        else{
            console.log(result);
            res.status(500).json({"Result":"Internal Error"});
        }
    });
});


module.exports = app;