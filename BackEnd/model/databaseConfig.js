/*
    Name: Ruan Chamei
    Class: DISM/FT/2A/02
    Admin: p2111492
*/ 

var mysql = require('mysql')
var dbconnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "password",     
            database: "spair"      
        });
        return conn;
    }
};
module.exports = dbconnect