/*
    Name: Ruan Chamei
    Class: DISM/FT/2A/02
    Admin: p2111492
*/ 

var db = require('./databaseConfig.js');

module.exports = {
// Endpoint Login --used
    verify: function (username, password, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection gt issue!
                console.log(err);
                return callback(err, null);
            } else {
                const query = "SELECT * FROM users WHERE username=? and password=?";
                dbConn.query(query, [username, password], (error, results) => {
                    if (error) {
                        callback(error, null);
                        return;
                    } else if (results.length === 0) {
                        return callback(null, null);
                    } else {
                        return callback(null, results[0]);
                    }
                });
            }
        });
    },
// Endpoint 01 POST /users --used
    insertUser: (username, email, contact, password, role, callback)=>{
        var conn = db.getConnection();
        conn.connect((err)=>{
            if (err){
                console.log(err);
                return callback(err, null);
            } else{
                console.log("Connected: Inside users.js insertUser()!");
                var sql = `INSERT INTO users (username, email, contact, password, role) values(?,?,?,?,?)`;
                conn.query(sql, [username, email, contact, password, role], (err, result) => {
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

    // Endpoint 03 GET /user/:id --used
    getUser: (userid, callback)=> {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            }
            else {
                console.log("Connected: Inside users.js getUser()!");
                var sql =
                `
                SELECT 
                    userid, username, email, contact, role, profile_pic_url, created_at
                FROM
                    users
                WHERE 
                    userid = ?
                `;   //for secuity sake
                conn.query(sql, [userid], function (err, result) {
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

    // Endpoint 04 PUT /users/:id --used
    updateUser: (username, email, contact, password, role, profile_pic_url, userid, callback)=> { 
        var conn = db.getConnection(); 
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            }
            else {
                console.log("Connected: Inside users.js updateUser()!");
                var sql = 
                `
                UPDATE 
                    users
                SET
                    username = ?,
                    email = ?,
                    contact = ?,
                    password = ?,
                    role = ?,
                    profile_pic_url = ?
                WHERE 
                    userid = ?
                `;   //for secuity sake //follow mysql
                conn.query(sql, [username, email, contact, password, role, profile_pic_url, userid], function (err, result) {
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
//========================================

// Endpoint 02 GET /users
    getUsers: (callback)=> {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            }
            else {
                console.log("Connected: Inside users.js getUsers()!");
                var sql = 
                `
                SELECT 
                    userid, username, email, contact, role, profile_pic_url, created_at
                FROM
                    users
                `;
                conn.query(sql, function (err, result) {
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
    
// Endpoint (advanced 01) PUT /userImg/:id
    updateImg: (randomImg, userid, callback)=>{
        var conn = db.getConnection();
        conn.connect((err)=>{
            if (err){
                console.log(err);
                return callback(err, null);
            } else{
                console.log("Connected: Inside users.js insertImg()!");
                var sql = 
                `
                UPDATE 
                    users
                SET
                    randomimg = LOAD_FILE(?)
                WHERE 
                    userid = ?
                `;   //for secuity sake //follow mysql;
                conn.query(sql, [randomImg, userid], (err, result) => {
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