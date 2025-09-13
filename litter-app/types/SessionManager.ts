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
        GET_SESSION_FROM_ID: "SELECT * FROM sessions WHERE user_id = ?",
        INSERT_NEW_SESSION: "INSERT INTO sessions (user_id) VALUES (?)"
    };
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
    private static genReturningQuery(column: string): string {
        return "RETURNING " + column;
    }

    public static async init(idColumn: string, tableName: string): Promise<SessionManager> {
        const session = new SessionManager(idColumn, tableName);
        const columns = await session.fetchColumns(tableName);
        await session.constructor(idColumn, tableName, columns);
        return session;
    }

    async fetchColumns(tableName: string): Promise<string[]> {
        const result = await db.query("SHOW COLUMNS FROM " + tableName);
        let columns: string[] = [];
        for (let i = 0; i < result[0].length(); ++i) {
            columns.push(result[0][i]);
        }
        return columns;
    }

    async createNewSession(userId: string): Promise<string> {
        const result = (await db.query(SessionManager.QUERIES.INSERT_NEW_SESSION + SessionManager.genReturningQuery(this.getIdColumn), [
            userId
        ])) as any; // 今回カラムは別途取得してObjectとして扱うためany型定義は回避
        return result[0];
    }

    async getSessionFromId(sessionId: string): Promise<QueryResult.QueryResult<Map<string, string>>> {
        const result = await db.query(SessionManager.QUERIES.GET_SESSION_FROM_ID, [sessionId]);
        if (result.length == 0) {
            return new QueryResult.QueryResult(false, new Map(), SessionManager.SESSION_NOT_FOUND);
        } else {
            let session: Map<string, string> = new Map();
            for (const key of Object.keys(result[0])) {
                session.set(key, result[0][key].toString());
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
        console.log(query, params);
        await db.query(query, params);
    }
}
export { SessionManager };
