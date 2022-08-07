/*
    Name: Ruan Chamei
    Class: DISM/FT/2A/02
    Admin: p2111492
*/ 

var db = require('./databaseConfig.js');

module.exports = {
// Endpoint 07 POST /flight
    insertFlight: (flightCode, aircraft, originAirportid, destinationAirportid, embarkDate, embarkTime, arrivedDate, arrivedTime, travelTime, price, callback)=>{
        var conn = db.getConnection();
        conn.connect((err)=>{
            if (err){
                console.log(err);
                return callback(err, null);
            } else{
                console.log("Connected: Inside flights.js insertFlight()!");
                var sql = `INSERT INTO flights (flightCode, aircraft, originAirportid, destinationAirportid, embarkDate, embarkTime, arrivedDate, arrivedTime, travelTime, price) values(?,?,?,?,?,?,?,?,?,?)`;
                conn.query(sql, [flightCode, aircraft, originAirportid, destinationAirportid, embarkDate, embarkTime, arrivedDate, arrivedTime, travelTime, price], (err, result) => {
                    conn.end();
                    if(err){
                        console.log(err);
                        return callback(err, null);
                    }else{
                        console.log(result.affectedRows + ' row is inserted');
                        return callback(null, result);
                    }
                });
            }
        });
    },

// Endpoint 08 GET /flightDirect/:originAirportId/:destinationAirportId --used
    getFlightAirportName: (originAirportid, destinationAirportid, embarkDate, callback)=>{
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            }
            else {
                console.log("Connected: Inside flights.js getFlightAirportName()!");
                var sql = `
                SELECT 
                    f.flightid, f.flightCode, f.aircraft, a1.name AS originAirport, a2.name AS destinationAirport, a1.country AS originCountry, a2.country AS destinationCountry, a1.shortform AS originAirportShortform, a2.shortform AS destinationAirportShortform, f.embarkDate, f.embarkTime,f.arrivedDate, f.arrivedTime, f.travelTime, f.price
                FROM 
                    flights f
                JOIN 
                    airports a1
                ON 
                    f.originAirportid = a1.airportid
                JOIN 
                    airports a2
                ON 
                    f.destinationAirportid = a2.airportid
                WHERE 
                    a1.airportid = ${originAirportid}
                AND 
                    a2.airportid = ${destinationAirportid}
                AND 
                    f.embarkDate = ?
                `;
                conn.query(sql, [embarkDate], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },


// Endpoint 11 GET /transfer/flight/:originAirportId/:destinationAirportId --used
    getTransfer: (originAirportid, destinationAirportid, departureDateInput, callback)=>{
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            }
            else {
                console.log("Connected: Inside flights.js getTransfer()!");
                var sql = 
                `
                SELECT 
                    f1.flightid AS firstFlightId, f2.flightid AS secondFlightId, f1.embarkDate AS firstFlightEmbarkDate, f1.embarkTime AS firstFlightEmbarkTime, f2.arrivedDate AS secondFlightArrivedDate, f2.arrivedTime AS secondFlightArrivedTime, f1.flightCode AS flightCode1, f2.flightCode AS flightCode2, f1.aircraft AS aircraft1, f2.aircraft AS aircraft2, a1.country AS originCountry, a2.country AS transferCountry, a3.country AS destinationCountry, a1.shortform AS originAirportShortform, a2.shortform AS transferAirportShortform, a3.shortform AS destinationAirportShortform,  a1.name AS originAirport, a2.name AS transferAirport, a3.name AS destinationAirport, sum(f1.price+f2.price) AS price
                FROM 
                    flights f1
                JOIN
                    flights f2
                ON 
                    f1.destinationAirportid = f2.originAirportid
                JOIN 
                    airports a1
                ON 
                    a1.airportid = f1.originAirportid
                JOIN 
                    airports a2
                ON 
                    a2.airportid = f1.destinationAirportid
                JOIN 
                    airports a3
                ON 
                    a3.airportid = f2.destinationAirportid
                WHERE 
                    f1.originAirportid = ?
                AND
                    f2.destinationAirportid = ?
                AND
                    f1.embarkDate = ?
                `;
                conn.query(sql, [originAirportid, destinationAirportid, departureDateInput], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },
}