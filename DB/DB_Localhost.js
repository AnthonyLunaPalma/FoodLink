const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host:'localhost',
    port: 3306,
    user: 'root',
    password: 'S!caRu19301302',
    database: 'mydb',
    dateStrings: true,
});

module.exports = pool;