/*
    Name: Ruan Chamei
    Class: DISM/FT/2A/02
    Admin: p2111492
*/ 

var db = require('./databaseConfig.js');

module.exports = {
// Endpoint (advanced 02.1) GET /promotions
    getPromotions: (callback)=> {
    var conn = db.getConnection();
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return callback(err,null);
        }
        else {
            console.log("Connected: Inside promotion.js getPromotions()!");
            var sql = 
            `
            SELECT 
                *
            FROM
                promotion
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

// Endpoint (advanced 02.2) POST /promotion
    insertPromotion: (period, code, flightCode, flightid, discount, description, callback)=>{
        var conn = db.getConnection();
        conn.connect((err)=>{
            if (err){
                console.log(err);
                return callback(err, null);
            } else{
                console.log("Connected: Inside promotion.js insertPromotion()!");
                var sql = `INSERT INTO promotion (period, code, flightCode, flightid, discount, description) values(?,?,?,?,?,?)`;
                conn.query(sql, [period, code, flightCode, flightid, discount, description], (err, result) => {
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

// Endpoint (advanced 02.3) DELETE /promotion/:id
    deletePromotion: (promotionid, callback)=> {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            }
            else {    
                console.log("Connected: Inside promotion.js deletePromotion()!");
                var sql = 'Delete from promotion where promotionid=?';
                conn.query(sql, [promotionid], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null,result);
                    }
                });
            }        
        });  
        
    },
    
// Endpoint (advanced 02.4) PUT /promotion/:id
    updatePromotion: (period, code, flightCode, flightid, discount, description, promotionid, callback)=> { 
        var conn = db.getConnection(); 
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            }
            else {
                console.log("Connected: Inside promotion.js updatePromotion()!");
                var sql = 
                `
                UPDATE 
                    promotion
                SET
                    period = ?, 
                    code = ?, 
                    flightCode = ?, 
                    flightid = ?, 
                    discount = ?, 
                    description = ?, 
                WHERE 
                    promotionid = ?
                `;   //for secuity sake //follow mysql
                conn.query(sql, [period, code, flightCode, flightid, discount, description, promotionid], function (err, result) {
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
    }
}