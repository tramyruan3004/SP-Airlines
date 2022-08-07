const express = require("express");
const app = express();
const path = require('path')

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/static', express.static(path.join(__dirname, 'css')))
// app.use(express.static(path.join(__dirname, '/public')));
// var serveStatic = require('serve-static')
// var serve = serveStatic('public', { index: ['index.html', 'index.htm'] })

app.get("/", (req, res) => {
  res.sendFile("/public/index.html", { root: __dirname });
});

app.get("/manageAirports/", (req, res) => {
  res.sendFile("/public/manageAirports.html", { root: __dirname });
});

app.get("/login/", (req, res) => {
  res.sendFile("/public/index.html", { root: __dirname });
});

app.get("/manageFlights/", (req, res) => {
  res.sendFile("/public/manageFlights.html", { root: __dirname });
});

app.get("/signup/", (req, res) => {
  res.sendFile("/public/signUp.html", { root: __dirname });
});

app.get("/viewprofile/", (req, res) => {
  res.sendFile("/public/viewProfile.html", { root: __dirname });
});


app.get("/cssNav/", (req, res) => {
  res.sendFile("/css/spair_navBarnFooter.css", { root: __dirname });
});

app.get("/cssViewProfile/", (req, res) => {
  res.sendFile("/css/viewProfile.css", { root: __dirname });
});

app.get("/jsRandom/", (req, res) => {
  res.sendFile("/public/js/randomQuote.js", { root: __dirname });
});
//--------------------------------------

// equivalent to our Assignment Endpoint03 viewProfile
app.get("/users/:id", (req, res) => {
  res.sendFile("/public/user.html", { root: __dirname });
});



app.all("*", (req, res) => {
    res.sendStatus(400);
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Client Server started at localhost:${PORT}`)
});
