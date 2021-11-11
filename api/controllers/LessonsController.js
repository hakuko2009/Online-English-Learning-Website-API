'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')

module.exports = {
    get: (req, res) => {
        let sql = 'SELECT * FROM baihoc'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    detail: (req, res) => {
        let sql = 'SELECT * FROM baihoc WHERE mabaihoc = ?'
        db.query(sql, [req.params.mabaihoc], (err, response) => {
            if (err) throw err
            res.json(response[0])
        })
    },
    update: (req, res) => {
        let data = req.body;
        let mabaihoc = req.params.mabaihoc;
        let sql = 'UPDATE baihoc SET ? WHERE mabaihoc = ?'
        db.query(sql, [data, mabaihoc], (err, response) => {
            if (err) throw err
            res.json({message: 'Cập nhật bài học thành công!'})
        })
    },
    store: (req, res) => {
        let data = req.body;
        let sql = 'INSERT INTO baihoc SET ?'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            res.json({message: 'Thêm bài học thành công!'})
        })
    },
    delete: (req, res) => {
        let sql = 'DELETE FROM baihoc WHERE mabaihoc = ?'
        db.query(sql, [req.params.mabaihoc], (err, response) => {
            if (err) throw err
            res.json({message: 'Xóa bài học thành công'})
        })
    }
}