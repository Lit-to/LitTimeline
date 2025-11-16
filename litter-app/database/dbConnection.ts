import mysql from "mysql2/promise";
//各メソッドのインポート
import * as getIdCount from "./methods/getIdCount.ts";
import * as getName from "./methods/getName.ts";
import * as getPassword from "./methods/getPassword.ts";
import * as insertUser from "./methods/insertUser.ts";
import * as insertPost from "./methods/insertPosts.ts";
import * as removeUser from "./methods/removeUser.ts";
import * as updateId from "./methods/updateId.ts";
import * as updateName from "./methods/updateName.ts";
import * as updatePassword from "./methods/updatePassword.ts";
import * as getPosts from "./methods/getPost.ts";
import * as getTimeline from "./methods/getTimeline.ts";

export { getIdCount, getName, getPassword, insertUser, insertPost, removeUser, updateName, updateId, updatePassword, getPosts, getTimeline };

type RowDataPacket = import("mysql2").RowDataPacket;
const { createPool } = mysql;

/**
 * DB接続プールを作成する
 *
 * @returns {mysql.Pool}
 */
function createDBPool(): mysql.Pool {
    return createPool({
        host: "litter-db", // MySQLのホスト
        user: "api", // MySQLのユーザー
        password: "password", // ユーザーのパスワード
        database: "litter" // 接続するデータベース名
    });
}

/**
 * クエリ発行メソッド
 *
 * @async
 * @template {RowDataPacket} [T=RowDataPacket]
 * @param {string} sql - mysqlのクエリ
 * @param {?any[]} [params] - パラメータ(?に当てはまる値)
 * @returns {Promise<T[]>} - クエリ結果の行データ配列
 */
async function query<T extends RowDataPacket = RowDataPacket>(sql: string, params?: any[]): Promise<T[]> {
    let rows: T[] = [];
    try {
        [rows] = await pool.query<T[]>(sql, params);
    } catch (err) {
        console.error("SQL execution failed:", err);
    }
    return rows;
}

/**
 * DB切断関数(テスト用)
 *
 * @async
 */
async function closePool(): Promise<void> {
    await pool.end();
}

const pool = createDBPool();
export { query, closePool, createDBPool };
