'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')

module.exports = {
    get: (req, res) => {
        let sql = 'SELECT * FROM danhmucbaihoc'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    detail: (req, res) => {
        let sql = 'SELECT * FROM danhmucbaihoc WHERE madanhmuc = ?'
        db.query(sql, [req.params.madanhmuc], (err, response) => {
            if (err) throw err
            res.json(response[0])
        })
    },
    update: (req, res) => {
        let data = req.body;
        let sql = 'UPDATE danhmucbaihoc SET ? WHERE madanhmuc = ?'
        db.query(sql, [data, req.params.madanhmuc], (err, response) => {
            if (err) throw err
            res.json({message: 'Cập nhật danh mục bài học thành công!'})
        })
    },
    getAllLessions: (req, res) => {
        let sql = 'SELECT * FROM baihoc WHERE madanhmuc = ?'
        db.query(sql, [req.params.madanhmuc], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    
    // hien thi bai hoc cua moi danh muc, cua moi giao vien
}