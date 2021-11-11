'use strict'
const db = require('./../db')

exports.getUser = async username => {
    return new Promise(data => {
        try {
            const qr = "SELECT * FROM ADMIN WHERE admin_username = '" + username + "'" ;
            db.query(qr, (err, res) => {
                if(err){
                    throw err;
                }
                const row = res[0]
                data(row)
            });
        } catch {
            return null;
        }
    })
};
exports.updateRefreshToken = async(admin_username, refreshToken) => {
    return new Promise(result => {
        try {
            const qr = "UPDATE ADMIN Set refreshToken = '" + refreshToken 
                        + "' where admin_username = '" + admin_username + "'";  
                    
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


