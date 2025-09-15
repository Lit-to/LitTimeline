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
    private sessionIdColumn: string;
    private freeColumns: string[];
    private static SESSION_NOT_FOUND = "セッションがありません";
    private static presetKeys: Set<string> = new Set(["session_id", "expire_at", "created_at", "updated_at"]);
    private static QUERIES = {
        GET_SESSION_FROM_USER_ID: "SELECT * FROM litter.sessions WHERE user_id = ?;",
        GET_SESSION_FROM_SESSION_ID: "SELECT * FROM litter.sessions WHERE session_id = ?;",
        INSERT_NEW_SESSION: "INSERT INTO litter.sessions (session_id,[keys],expire_at) VALUES (@session_id, [placeHolders], NOW()+INTERVAL 30 DAY);",
        SHOW_COLUMNS: "SHOW COLUMNS FROM litter.sessions;",
        PUT_SESSION_ID: "SET @session_id = UUID();",
        GET_SESSION_ID: "SELECT @session_id AS session_id;",
        UPDATE_SESSION: "UPDATE litter.sessions SET [updatesContents] WHERE session_id = ?;"
    };
    private static putInsertQueries(keys: string[]) {
        let placeHolders = "?".repeat(keys.length).split("").join(" ,");
        return SessionManager.QUERIES.INSERT_NEW_SESSION.replace("[keys]", keys.join(",")).replace("[placeHolders]", placeHolders);
    }
    private static putUpdateQueries(keys: string[]) {
        let updatesContents = keys.map((value) => value + "=?").join(", ");
        return SessionManager.QUERIES.UPDATE_SESSION.replace("[updatesContents]", updatesContents);
    }
    private constructor(idColumn: string, tableName: string, columns: string[] = []) {
        this.tableName = tableName;
        this.sessionIdColumn = idColumn;
        this.columns = columns;
        this.freeColumns = this.columns.filter((value) => !SessionManager.presetKeys.has(value));
    }
    private get getIdColumn(): string {
        return this.sessionIdColumn;
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
    private get getFreeColumns(): string[] {
        return this.freeColumns;
    }

    public static async init(idColumn: string, tableName: string): Promise<SessionManager> {
        const columns = await SessionManager.fetchColumns(tableName);
        return new SessionManager(idColumn, tableName, columns);
    }

    static async fetchColumns(tableName: string): Promise<string[]> {
        const result = await db.query(SessionManager.QUERIES.SHOW_COLUMNS);
        let columns: string[] = [];
        for (let i = 0; i < result.length; ++i) {
            columns.push(result[i].Field);
        }
        return columns;
    }

    async createNewSession(userId: string): Promise<string> {
        await db.query(SessionManager.QUERIES.PUT_SESSION_ID);
        console.log(this.columns, userId);
        console.log(SessionManager.putInsertQueries(this.getFreeColumns));
        (await db.query(SessionManager.putInsertQueries(this.getFreeColumns), [userId, false])) as any; // 今回カラムは別途取得してObjectとして扱うためany型定義で回避
        const insertResult = await db.query(SessionManager.QUERIES.GET_SESSION_ID);
        return insertResult[0][this.sessionIdColumn];
    }

    async getSessionFromSessionId(sessionId: string): Promise<QueryResult.QueryResult<Map<string, string>>> {
        const result = await db.query(SessionManager.QUERIES.GET_SESSION_FROM_SESSION_ID, [sessionId]);
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
        let params = [];
        for (const key of this.getFreeColumns) {
            params.push(session.get(key));
        }
        params.push(session.get(this.sessionIdColumn));
        console.log(SessionManager.putUpdateQueries(this.getFreeColumns), params);
        await db.query(SessionManager.putUpdateQueries(this.getFreeColumns), params);
    }
}
export { SessionManager };
