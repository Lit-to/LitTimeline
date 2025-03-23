import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',      // MySQLのホスト
    user: 'api',       // MySQLのユーザー
    password: 'password',   // ユーザーのパスワード
    database: 'litter',    // 接続するデータベース名
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
