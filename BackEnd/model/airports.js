/*
    Name: Ruan Chamei
    Class: DISM/FT/2A/02
    Admin: p2111492
*/ 

var db = require('./databaseConfig.js');

module.exports = {

// Endpoint 05 POST /airport --used
    insertAirport: (name, country, shortform, callback)=>{
        var conn = db.getConnection();
        conn.connect((err)=>{
            if (err){
                console.log(err);
                return callback(err, null);
            } else{
                console.log("Connected: Inside airports.js insertAirport()!");
                var sql = `INSERT INTO airports (name, country, shortform) values(?,?,?)`;
                conn.query(sql, [name, country, shortform], (err, result) => {
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
    
// Endpoint 06 GET /airport --used
    getAirports: (callback)=>{
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            }
            else {
                console.log("Connected: Inside airports.js getAirports()!");
                var sql = 
                `
                SELECT 
                    airportid, name, country
                FROM
                    airports
                `;
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        return callback(err,null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },   
}