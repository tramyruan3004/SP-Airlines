var express = require("express");
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
    usersDB.insertUser(req.body.username, req.body.email, req.body.contact, req.body.password, req.body.role, req.body.profile_pic_url, function (err, result) {
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
//===============================================================================



// Endpoint 03 GET /users/:id
app.get('/user/:id', function (req, res) {
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

// Endpoint 04 PUT /users/:id
app.put('/users/:id', function (req, res) {
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

app.get('/transfer/flight/:originAirportId/:destinationAirportId', function (req, res) {
    var originAirportid =  req.params.originAirportId;
    var destinationAirportid =  req.params.destinationAirportId;
    if (isNaN(originAirportid) || isNaN(destinationAirportid)){
        res.status(500).json({"Result":"Internal Error"});
        return;
    }
    flightsDB.getTransfer(originAirportid, destinationAirportid, function (err, result) {
        if (!err) {
            console.log(result);
            if (result[0].firstFlightId == null){
                res.status(200).json("No such transfer flight exists!");
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

//---------------------------------------------------------------------- sample
app.put("/user/:userid", isLoggedInMiddleware, (req, res) => {
    var userid = parseInt(req.params.userid);
    if (isNaN(userID)) {
        res.status(400).send("Do not understand which user you want...");
        return;
    } else {
        if (userid !== req.decodedToken.user_id) {
            res.status(403).send();
            return;
        } else {
            userDB.edit(userid, req.body, (error, results) => {
                if (error) {
                    res.status(500).send(error);
                } else {
                    res.status(201).send(results);
                }
            });
        }
    }
});
  
app.get("/users/:userid", (req, res) => { //change from user to users
    var userid = req.params.userid;
    userDB.findByID(userid, (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(results[0]);
        }
    });
});


app.post("/user", (req, res) => {
    console.log(req.body);
    userDB.insert(req.body, (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(results);
        }
    });
});

app.delete("/user/:userid", isLoggedInMiddleware, (req, res) => {
    var userid = parseInt(req.params.userid);
    if (isNaN(userid)) {
        res.status(400).send("Do not understand which user you want...");
        return;
    } else {
        userDB.delete(userid, (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(results);
            }
        });
    }
});

// Friendship endpoints

app.post("/users/:userID/friends/:friendID", isLoggedInMiddleware, (req, res) => {
    const userID = parseInt(req.params.userID);
    const friendID = parseInt(req.params.friendID);
    if (isNaN(userID) || isNaN(friendID)) {
        res.status(400).send("Do not understand which user you are looking for?");
        return;
    } else if (userID === friendID) {
        res.status(400).send("You are already your own best friend...");
        return;
    } else if (userID !== req.decodedToken.user_id) {
        // user ID in the request params should be the same as the logged in user ID
        res.status(403).send("You are not allowed to impersonate another...");
        return;
    } else {
        friendshipDB.addFriend(userID, friendID, (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(results);
            }
        });
    }
});

app.delete("/users/:userID/friends/:friendID", isLoggedInMiddleware, (req, res) => {
    const userID = parseInt(req.params.userID);
    const friendID = parseInt(req.params.friendID);
    if (isNaN(userID) || isNaN(friendID)) {
        res.status(400).send("Do not understand which user you are looking for?");
        return;
    } else if (userID === friendID) {
        res.status(400).send("Cannot unfriend yourself. You are your own best friend...");
        return;
    } else if (userID !== req.decodedToken.user_id) {
        // user ID in the request params should be the same as the logged in user ID
        res.status(403).send("You are not authorized to do this...");
        return;
    } else {
        friendshipDB.removeFriend(userID, friendID, (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(results);
            }
        });
    }
});

app.post("/friendship/:userIDOne/:userIDTwo", (req, res) => {
    var userIDOne = req.params.userIDOne;
    var userIDTwo = req.params.userIDTwo;
    friendshipDB.addFriend(userIDOne, userIDTwo, (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(results);
        }
    });
});

app.delete("/friendship/:userIDOne/:userIDTwo", isLoggedInMiddleware, (req, res) => {
    var userIDOne = req.params.userIDOne;
    var userIDTwo = req.params.userIDTwo;
    friendshipDB.removeFriend(userIDOne, userIDTwo, (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(results);
        }
    });
});

app.get("/friendship/:userid", isLoggedInMiddleware, (req, res) => {
    var userid = req.params.userid;
    friendshipDB.showFriends(userid, (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(results);
        }
    });
});

app.get("/users/:userid/friends", (req, res) => {
    var userid = req.params.userid;
    friendshipDB.showFriends(userid, (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(results);
        }
    });
});

// Post endpoints

// app.post("/posts", isLoggedInMiddleware, (req, res) => {
//     var post = {text_body: req.body.post, fk_poster_id: req.decodedToken.user_id};
//     postDB.insert(post, (error, results) => {
//         console.log(post, error, results);
//         if (error) {
//             res.status(400).send(error);
//         } else {
//             res.status(200).send(results);
//         }
//     });
// });

app.post("/posts", (req, res) => {
    // the req.body keys are wrong over here and I have changed them.
    var post = {text_body: req.body.text_body, fk_poster_id: req.body.fk_poster_id};
    postDB.insert(post, (error, results) => {
        console.log(post, error, results);
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(results);
        }
    });
});

app.get("/posts/:postID", (req, res) => {
    var postID = parseInt(req.params.postID);
    if (isNaN(postID)) {
        res.status(400).send("Do not understand which post you want...");
        return;
    } else {
        postDB.findByID(postID, (error, results) => {
            if (error) {
                res.status(400).send(error);
                return;
            } else if (results.length == 0) {
                res.status(403).send("Cannot find record leh...");
                return;            
            } else {
                res.status(200).send(results[0]);//sending the object not the array
            }
        });  
    }
});

app.put("/posts/:postID", isLoggedInMiddleware, (req, res) => {
    var postID = parseInt(req.params.postID);
    if (isNaN(postID)) {
        res.status(400).send("Do not understand which post you want...");
        return;
    } else {
        postDB.findByID(postID, (error, results) => {
            if (error) {
                res.status(400).send(error);
                return;
            } else if (results.length == 0) {
                res.status(403).send("Cannot find record leh...");
                return;            
            } else if (results[0].fk_poster_id !== req.decodedToken.user_id) {
                res.status(403).send("You can only update your own post.");
                return;
            } else {
                postDB.edit(postID, req.body, (error, results) => {
                    if (error) {
                        res.status(500).send(error);
                    } else {
                        res.status(200).send(results);
                    }
                });
            }
        });  
    }
});

app.delete("/posts/:postID", isLoggedInMiddleware, (req, res) => {
    var postID = parseInt(req.params.postID);
    if (isNaN(postID)) {
        res.status(400).send("Do not understand which post you want...");
        return;
    } else {
        postDB.findByID(postID, (error, results) => {
            if (error) {
                res.status(400).send(error);
                return;
            } else if (results.length == 0) {
                res.status(403).send("Cannot find record leh...");
                return;
            } else if (results[0].fk_poster_id !== req.decodedToken.user_id) {
                res.status(403).send("You can only delete your own post.");
                return;
            } else {
                postDB.delete(postID, (error, results) => {
                    if (error) {
                        res.status(500).send(error);
                    } else {
                        res.status(200).send(results);
                    }
                });
            }
        });  
    }
});

app.get("/likersOfPostByUser/:userid", (req, res) => {
    var userid = req.params.userid;
    postDB.findByUserID(userid, (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(results);
        }
    });
});

app.get("/users/:userid/posts", (req, res) => {
    var userid = req.params.userid;
    postDB.findByUserID(userid, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            res.status(200).send(results);
        }
    });
});

// Likes endpoints

app.post("/posts/:postID/likers/:likerID/", isLoggedInMiddleware, (req, res) => {
    var postID = parseInt(req.params.postID);
    var likerID = parseInt(req.params.likerID);

    var errorMessage = "";
    if (isNaN(postID)) errorMessage = "Unable to process postID. "
    if (isNaN(likerID)) errorMessage += "Unable to process likerID. "

    if (errorMessage !== "") {
        res.status(400).send(errorMessage);
        return;
    } else if (likerID !== req.decodedToken.user_id) {
        res.status(403).send("You can only post your own likes.");
        return;
    } else {
        likesDB.like(postID, likerID, req.body, (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(results);
            }
        });
    }
});

app.post("/likePost/:postID/", isLoggedInMiddleware, (req, res) => {
    var postID = parseInt(req.params.postID);

    var errorMessage = "";
    if (isNaN(postID)) {
        errorMessage = "Unable to process postID. "
        res.status(400).send(errorMessage);
        return;
    } else {
        likesDB.like(postID, req.decodedToken.user_id, req.body, (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(results);
            }
        });
    }
});

app.delete("/posts/:postID/likers/:likerID/", isLoggedInMiddleware, (req, res) => {
    var postID = parseInt(req.params.postID);
    var likerID = parseInt(req.params.likerID);

    var errorMessage = "";
    if (isNaN(postID)) errorMessage = "Unable to process postID. "
    if (isNaN(likerID)) errorMessage += "Unable to process likerID. "

    if (errorMessage !== "") {
        res.status(400).send(errorMessage);
        return;
    } else if (likerID !== req.decodedToken.user_id) {
        res.status(403).send("You can only unlike your own likes...");
        return;
    } else {
        likesDB.unlike(postID, likerID, req.body, (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(results);
            }
        });
    }
});

app.delete("/unlikePost/:postID/", isLoggedInMiddleware, (req, res) => {
    var postID = parseInt(req.params.postID);

    if (isNaN(postID)) {
        errorMessage = "Unable to process postID. "
        res.status(400).send(errorMessage);
        return;
    } else {
        likesDB.unlike(postID, req.decodedToken.user_id, req.body, (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(results);
            }
        });
    }
});

module.exports = app;