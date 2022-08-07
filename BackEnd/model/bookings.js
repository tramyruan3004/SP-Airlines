/*
    Name: Ruan Chamei
    Class: DISM/FT/2A/02
    Admin: p2111492
*/ 

var db = require('./databaseConfig.js');

module.exports = {
// Endpoint 09 POST /booking/:userid/:flightid
    insertBooking: (userid, name, passport, nationality, age, flightCode, flightid, callback)=>{
        var conn = db.getConnection();
        conn.connect((err)=>{
            if (err){
                console.log(err);
                return callback(err, null);
            } else{
                console.log("Connected: Inside bookings.js insertBooking()!");
                var sql = `INSERT INTO bookings (userid, name, passport, nationality, age, flightCode, flightid) values(?,?,?,?,?,?,?)`;
                conn.query(sql, [userid, name, passport, nationality, age, flightCode, flightid], (err, result) => {
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
}