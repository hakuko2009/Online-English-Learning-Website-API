'use strict';

const mysql = require('mysql');
const db = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1', 
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'Tvxqmyproudlove1332000!',
    database: process.env.DB_NAME || 'demo_api'
  });
  
module.exports = db
