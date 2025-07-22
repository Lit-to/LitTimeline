import mysql from "mysql2/promise";
type RowDataPacket = import("mysql2").RowDataPacket;
const { createPool } = mysql;

const pool = createPool({
    host: "litter-db", // MySQLのホスト
    user: "api", // MySQLのユーザー
    password: "password", // ユーザーのパスワード
    database: "litter" // 接続するデータベース名
});

// const connection:any = mysql.createConnection({
// host: "litter-db", // MySQLのホスト
// user: "api", // MySQLのユーザー
// password: "password", // ユーザーのパスワード
// database: "litter", // 接続するデータベース名
// });

async function query<T extends RowDataPacket = RowDataPacket>(
    sql: string,
    params?: any[]
): Promise<T[]> {
    let rows: T[] = [];
    try {
        [rows] = await pool.execute<T[]>(sql, params);
    } catch (err) {
        console.error("SQL execution failed:", err);
    }
    return rows;
}

export default query;
