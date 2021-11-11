'use strict'

const util = require('util')
const db = require('./../db')
const bcrypt = require('bcryptjs');;
const randToken = require('rand-token');

const userModel = require('../models/AdminModel');
const authMethod = require('../methods/AuthMethod');

const jwtVariable = require('../../variables/jwt');
const {SALT_ROUNDS} = require('../../variables/auth');

module.exports = {
    login: async(req, res) =>{
        const username = req.body.admin_username;
	    const password = req.body.admin_password;
    
        const login = await userModel.getUser(username);
        if (!login) {
            return res.status(401).send('Tên đăng nhập không tồn tại.');
        }
    
        const isPasswordValid = (password == login.Admin_password);
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
            await userModel.updateRefreshToken(login.Admin_username, refreshToken);
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
    detail: (req, res) => {
        let sql = 'SELECT * FROM ADMIN WHERE admin_username = ?'
        db.query(sql, [req.params.admin_username], (err, response) => {
            if (err) throw err
            res.json(response[0])
        })
    },
    
    update: (req, res) => {
        let obj = req.body

        let data = `admin_password = '${obj.admin_password}', `
                + `email = '${obj.email}', `
                + `sdt = '${obj.sdt}'`

        let admin_username = req.params.admin_username;
        let sql = 'UPDATE ADMIN SET ' + data + ' WHERE admin_username = ?'
        db.query(sql, admin_username, (err, response) => {
            
            if (err) throw err
            res.json({message: 'Cập nhật thông tin thành công!'})
        })
    },
}