const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'litter-db',      // MySQLのホスト
    user: 'api',       // MySQLのユーザー
    password: 'password',   // ユーザーのパスワード
    database: 'litter-db',    // 接続するデータベース名
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
