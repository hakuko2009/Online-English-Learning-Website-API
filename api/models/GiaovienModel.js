'use strict'
const db = require('./../db')

exports.getUser = async username => {
    return new Promise(data => {
        try {
            const qr = "SELECT * FROM GIAOVIEN WHERE GV_username = '" + username + "'" ;
            db.query(qr, (err, res) => {
                if(err){
                    throw err;
                }
                const row = res[0]
                 //  [RowDataPacket { HV_password: 'sdsds' }]
                data(row)
            });
        } catch {
            return null;
        }
    })
};
exports.updateRefreshToken = async (gv_username, refreshToken) => {
    return new Promise(result => {
        try {
            const qr = "UPDATE GIAOVIEN Set refreshToken = '" + refreshToken 
                        + "' where GV_username = '" + gv_username + "'";  
                    
            db.query(qr, (err, res) =>{ 
                console.log(qr);
                if(err){
                    throw err;
                }
                console.log(res);
                result(true);
            });   
        } catch {
            return false;
        }
    }) 
};

