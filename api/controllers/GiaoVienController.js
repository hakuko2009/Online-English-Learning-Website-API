'use strict'

const util = require('util')
const db = require('./../db')
const bcrypt = require('bcryptjs');;
const randToken = require('rand-token');

const userModel = require('../models/GiaovienModel');
const authMethod = require('../methods/AuthMethod');

const jwtVariable = require('../../variables/jwt');
const {SALT_ROUNDS} = require('../../variables/auth');

module.exports = {

    login: async(req, res) =>{
        const username = req.body.gv_username;
	    const password = req.body.gv_password;
    
        const login = await userModel.getUser(username);
        if (!login) {
            return res.status(401).send('Tên đăng nhập không tồn tại.');
        }
    
        const isPasswordValid = (password == login.GV_password);
        if (!isPasswordValid) {
            return res.status(401).send('Mật khẩu không chính xác.');
        }
    
        const accessTokenLife =
            process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
        const accessTokenSecret =
            process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
    
        const dataForAccessToken = {
            username: username,
        };
        const accessToken = await authMethod.generateToken(
            dataForAccessToken,
            accessTokenSecret,
            accessTokenLife,
        );
        if (!accessToken) {
            return res
                .status(401)
                .send('Đăng nhập không thành công, vui lòng thử lại.');
        }

        let refreshToken = randToken.generate(jwtVariable.refreshTokenSize); 
        if (login.refreshToken == null) {
            await userModel.updateRefreshToken(login.GV_username, refreshToken);
        } else {
            refreshToken = login.refreshToken;
        }
    
        return res.json({
            msg: 'Đăng nhập thành công.',
            accessToken,
            refreshToken,
            user: await userModel.getUser(username),
        });
    },

    refreshToken: async(req, res) =>{
        const accessTokenFromHeader = req.headers.x_authorization;
        if (!accessTokenFromHeader) {
            return res.status(400).send('Không tìm thấy access token.');
        }

        // Lấy refresh token từ body
        const refreshTokenFromBody = req.body.refreshToken;
        if (!refreshTokenFromBody) {
            return res.status(400).send('Không tìm thấy refresh token.');
        }

        const accessTokenSecret =
            process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
        const accessTokenLife =
            process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

        // Decode access token đó
        const decoded = await authMethod.decodeToken(
            accessTokenFromHeader,
            accessTokenSecret,
        );
        if (!decoded) {
            return res.status(400).send('Access token không hợp lệ.');
        }

        const username = decoded.payload.username; // Lấy username từ payload

        const user = await userModel.getUser(username);
        if (!user) {
            return res.status(401).send('User không tồn tại.');
        }

        if (refreshTokenFromBody !== user.refreshToken) {
            return res.status(400).send('Refresh token không hợp lệ.');
        }

        // Tạo access token mới
        const dataForAccessToken = {
            username,
        };

        const accessToken = await authMethod.generateToken(
            dataForAccessToken,
            accessTokenSecret,
            accessTokenLife,
        );
        if (!accessToken) {
            return res
                .status(400)
                .send('Tạo access token không thành công, vui lòng thử lại.');
        }
        return res.json({
            accessToken,
        });
    },
    get: (req, res) => {
        let sql = 'SELECT * FROM giaovien'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    detail: (req, res) => {
        let sql = 'SELECT * FROM giaovien WHERE gv_username = ?'
        db.query(sql, [req.params.gv_username], (err, response) => {
            if (err) throw err
            res.json(response[0])
        })
    },
    update: (req, res) => {
        let obj = req.body
    
        let data = `gv_password = '${obj.gv_password}', ` 
                + `tengv = '${obj.tengv}', `
                + `idnumber = '${obj.idnumber}', `
                + `gioitinh = '${obj.gioitinh}', `
                + `ngaysinh = '${obj.ngaysinh}', `
                + `email = '${obj.email}', `
                + `sdt = '${obj.sdt}', `
                + `diachi = '${obj.diachi}', `
                + `dvct = '${obj.dvct}', `
                + `avatar = '${obj.avatar}'`

        let gv_username = req.params.gv_username;
        let sql = 'UPDATE giaovien SET ' + data + ' WHERE gv_username = ?'
        db.query(sql, gv_username, (err, response) => {
            if (err) throw err
            res.json({message: 'Cập nhật thông tin giáo viên thành công!'})
        })
    },
    store: (req, res) => {
        let data = req.body;
        let sql = 'INSERT INTO giaovien SET ?'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            res.json({message: 'Thêm giáo viên thành công!'})
        })
    },
    delete: (req, res) => {
        let sql = 'DELETE FROM giaovien WHERE gv_username = ?'
        let gv_username = req.params.gv_username;
        db.query(sql, [gv_username], (err, response) => {
            if (err) throw err
            res.json({message: 'Xóa giáo viên thành công!'})
        })
    }
}