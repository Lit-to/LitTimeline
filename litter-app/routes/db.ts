import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2";

const pool = mysql.createPool({
    host: "litter-db", // MySQLのホスト
    user: "api", // MySQLのユーザー
    password: "password", // ユーザーのパスワード
    database: "litter", // 接続するデータベース名
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function query<T extends RowDataPacket = RowDataPacket>(
    sql: string,
    params?: any[]
): Promise<T[]> {
    const rows = [];
    try {
        console.log("Executing SQL:", sql, "with params:", params);
        const [rows] = await pool.execute<T[]>(sql, params);
        console.log("Query result:", rows);
    } catch (err) {
        console.error("SQL execution failed:", err);
    }
    return rows;
}

export default query;
