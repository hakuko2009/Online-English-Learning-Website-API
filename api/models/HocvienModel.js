'use strict'
const db = require('./../db')

const TABLENAME = 'HOCVIEN';
exports.getUser = async username => {
    return new Promise(data => {
        try {
            const qr = "SELECT * FROM HOCVIEN WHERE HV_username = '" + username + "'" ;
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
exports.updateRefreshToken = async (hv_username, refreshToken) => {
    return new Promise(result => {
        try {
            const qr = "UPDATE HOCVIEN Set refreshToken = '" + refreshToken 
                        + "' where HV_username = '" + hv_username + "'";  
                    
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
}


