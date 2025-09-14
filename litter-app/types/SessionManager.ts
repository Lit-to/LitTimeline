import * as db from "../database/dbConnection.ts";
import * as QueryResult from "../database/types/QueryResult.ts";

/**
 *
 * httpセッションを司るクラス
 * DBは既に作っている想定
 *
 * @class Session
 * @typedef {Session}
 */
class SessionManager {
    private tableName: string;
    private columns: string[];
    private idColumn: string;
    private static SESSION_NOT_FOUND = "セッションがありません";
    private static QUERIES = {
        GET_SESSION_FROM_USER_ID: "SELECT * FROM sessions WHERE",
        GET_SESSION_FROM_INSERT_ID: "SELECT * FROM sessions WHERE id = ?",
        INSERT_NEW_SESSION: "INSERT INTO sessions (session_id,user_id,expire_at) VALUES (@session_id,?,NOW()+INTERVAL 30 DAY)",
        SET_SID: "SET @session_id = UUID()",
        GET_SID: "SELECT @session_id AS "
    };
    private static getSidQuery(key: string): string {
        return SessionManager.QUERIES.GET_SID + key + ";";
    }
    private static getGetSessionQuery(idColumn: string): string {
        return SessionManager.QUERIES.GET_SESSION_FROM_USER_ID + " " + idColumn + " = ?;";
    }
    private constructor(idColumn: string, tableName: string, columns: string[] = []) {
        this.tableName = tableName;
        this.idColumn = idColumn;
        this.columns = columns;
    }
    private get getIdColumn(): string {
        return this.idColumn;
    }
    private get getTableName(): string {
        return this.tableName;
    }
    private set setTableName(value: string) {
        this.tableName = value;
    }
    private get getColumns(): string[] {
        return this.columns;
    }
    private static genReturningQuery(insertId: number): string {
        return "SELECT " + insertId.toString();
    }

    public static async init(idColumn: string, tableName: string): Promise<SessionManager> {
        const session = new SessionManager(idColumn, tableName);
        const columns = await SessionManager.fetchColumns(tableName);
        new SessionManager(idColumn, tableName, columns);
        return session;
    }

    static async fetchColumns(tableName: string): Promise<string[]> {
        const result = await db.query("SHOW COLUMNS FROM " + tableName);
        // const result = await db.query("select * from sessions limit 1");
        let columns: string[] = [];
        for (let i = 0; i < result.length; ++i) {
            columns.push(result[i].Field);
        }
        return columns;
    }
    async createNewSession(userId: string): Promise<string> {
        await db.query(SessionManager.QUERIES.SET_SID);
        (await db.query(SessionManager.QUERIES.INSERT_NEW_SESSION, [userId])) as any; // 今回カラムは別途取得してObjectとして扱うためany型定義は回避
        const insertResult = await db.query(SessionManager.getSidQuery(this.idColumn));
        return insertResult[0][this.idColumn];
    }

    async getSessionFromId(sessionId: string): Promise<QueryResult.QueryResult<Map<string, string>>> {
        const result = await db.query(SessionManager.getGetSessionQuery(this.idColumn), [sessionId]);
        if (result.length == 0) {
            return new QueryResult.QueryResult(false, new Map(), SessionManager.SESSION_NOT_FOUND);
        } else {
            let session: Map<string, string> = new Map();
            for (const key of Object.keys(result[0])) {
                session.set(key, result[0][key]);
            }
            return new QueryResult.QueryResult(true, session, "");
        }
    }

    async saveSession(session: Map<string, string>): Promise<void> {
        let data = [];
        let params = [];
        for (let i = 0; i < this.getColumns.length; ++i) {
            data.push(session.get(this.getColumns[i]) + "=" + "?");
            params.push(session.get(this.getColumns[i]));
        }
        params.push(session.get(this.getIdColumn));
        let query = "UPDATE " + this.tableName + " SET " + data.join(",") + " WHERE " + this.idColumn + " = ?";
        await db.query(query, params);
    }
}
export { SessionManager };
