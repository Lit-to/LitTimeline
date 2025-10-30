import * as db from "../database/dbConnection.ts";
import * as QueryResult from "../database/types/QueryResult.ts";

/**
 * @remarks
 * httpセッションを司るクラス
 * DBは既に作っている想定。以下DBに必須なカラム
 * - session_id: セッションID
 * - expire_at: セッションの有効期限
 *
 * @class Session
 * @field {string} tableName セッション情報を保存するテーブル名
 * @field {string} sessionIdColumn セッションIDを保存するカラム名
 * @field {string[]} columns テーブルの全カラム名
 * @field {string[]} freeColumns 自由に値を保存できるカラム名
 */
class SessionManager {
    public static hasInstance = false;
    public static instance: SessionManager;

    /**
     * 初期化関数(コンストラクタの代わり)
     * @param idColumn セッションIDを保存するカラム名
     * @param tableName セッション情報を保存するテーブル名
     * @returns {Promise<SessionManager>} インスタンス本体
     */
    public static async init(idColumn: string, tableName: string): Promise<void> {
        const columns = await SessionManager.fetchColumns(tableName);
        SessionManager.hasInstance = true;
        SessionManager.instance = new SessionManager(idColumn, tableName, columns);
    }

    public static getInstance(): SessionManager {
        if (!SessionManager.hasInstance) {
            throw new Error("SessionManager is not initialized. Please call init() first.");
        }
        return SessionManager.instance;
    }
    public static getHasInstance(): boolean {
        return SessionManager.hasInstance;
    }

    /**
     * テーブルのカラム名を取得する
     *
     * @public
     * @static
     * @async
     * @param {string} tableName テーブル名
     * @returns {Promise<string[]>} カラム名の配列
     */
    public static async fetchColumns(tableName: string): Promise<string[]> {
        const result = await db.query(SessionManager.QUERIES.SHOW_COLUMNS);
        let columns: string[] = [];
        for (let i = 0; i < result.length; ++i) {
            columns.push(result[i].Field);
        }
        return columns;
    }

    public static getBlankSession(): Map<string, string> {
        let session: Map<string, string> = new Map();
        for (const key of SessionManager.instance.getColumns) {
            session.set(key, "");
        }
        return session;
    }

    /**
     * 新しいセッションを作成する
     *
     * @public
     * @async
     * @param {string} userId ユーザーID
     * @returns {Promise<string>} セッションID
     */
    public async createNewSession(userId: string): Promise<string> {
        await db.query(SessionManager.QUERIES.PUT_SESSION_ID);
        (await db.query(SessionManager.putInsertQueries(this.getFreeColumns), [userId, false])) as any; // 今回カラムは別途取得してObjectとして扱うためany型定義で回避
        const insertResult = await db.query(SessionManager.QUERIES.GET_SESSION_ID);
        return insertResult[0][this.sessionIdColumn];
    }

    /**
     * ユーザーIDからセッションを取得する
     *
     * @public
     * @async
     * @param {string} sessionId セッションID
     * @returns {Promise<QueryResult.QueryResult<Map<string, string>>>} セッション情報
     */
    public async getSessionFromSessionId(sessionId: string): Promise<QueryResult.QueryResult<Map<string, string>>> {
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

    /**
     * セッション情報を保存する
     *
     * @public
     * @async
     * @param {Map<string, string>} session セッション情報
     * @returns {Promise<void>}
     */
    public async saveSession(session: Map<string, string>): Promise<void> {
        let params = [];
        for (const key of this.getFreeColumns) {
            params.push(session.get(key));
        }
        params.push(session.get(this.sessionIdColumn));
        await db.query(SessionManager.putUpdateQueries(this.getFreeColumns), params);
    }

    /**
     * コンストラクタ
     *
     * @constructor
     * @private
     * @param {string} idColumn セッションIDを保存するカラム名
     * @param {string} tableName セッション情報を保存するテーブル名
     * @param {string[]} [columns=[]] テーブルの全カラム名
     */
    private constructor(idColumn: string, tableName: string, columns: string[] = []) {
        this.tableName = tableName;
        this.sessionIdColumn = idColumn;
        this.columns = columns;
        this.freeColumns = this.columns.filter((value) => !SessionManager.presetKeys.has(value));
    }
    /**
     * セッションDBのテーブル名
     *
     * @private
     * @type {string}
     */
    private tableName: string;

    /**
     * カラム名の配列
     *
     * @private
     * @type {string[]}
     */
    private columns: string[];

    /**
     * セッションIDを保存するカラム名
     *
     * @private
     * @type {string}
     */
    private sessionIdColumn: string;

    /**
     * ユーザーがセッションidと有効期限以外のカラム配列
     *
     * @private
     * @type {string[]}
     */
    private freeColumns: string[];

    private static SESSION_NOT_FOUND = "セッションがありません";
    private static presetKeys: Set<string> = new Set(["session_id", "expire_at", "created_at", "updated_at"]); //必須カラム
    private static QUERIES = {
        // SQLクエリ
        GET_SESSION_FROM_USER_ID: "SELECT * FROM litter.sessions WHERE user_id = ?;",
        GET_SESSION_FROM_SESSION_ID: "SELECT * FROM litter.sessions WHERE session_id = ?;",
        INSERT_NEW_SESSION: "INSERT INTO litter.sessions (session_id,[keys],expire_at) VALUES (@session_id, [placeHolders], NOW()+INTERVAL 30 DAY);",
        SHOW_COLUMNS: "SHOW COLUMNS FROM litter.sessions;",
        PUT_SESSION_ID: "SET @session_id = UUID();", // UUID()でセッションIDを生成し、mysql変数に保存
        GET_SESSION_ID: "SELECT @session_id AS session_id;", // mysql変数からセッションIDを取得
        UPDATE_SESSION: "UPDATE litter.sessions SET [updatesContents] WHERE session_id = ?;" // [updatesContents]: カラム名=?をカラム数ぶん作った文字列
    };

    /**
     * INSERTクエリを生成する
     * [keys][placeHolders]を置き換えたINSERTクエリを返す
     *
     * @private
     * @static
     * @param {string[]} keys
     * @returns {*}
     */
    private static putInsertQueries(keys: string[]) {
        let placeHolders = "?".repeat(keys.length).split("").join(" ,");
        return SessionManager.QUERIES.INSERT_NEW_SESSION.replace("[keys]", keys.join(",")).replace("[placeHolders]", placeHolders);
    }

    /**
     * UPDATEクエリを生成する
     * [updatesContents]を置き換えたUPDATEクエリを返す
     * @private
     * @static
     * @param {string[]} keys
     * @returns {*}
     */
    private static putUpdateQueries(keys: string[]) {
        let updatesContents = keys.map((value) => value + "=?").join(", ");
        return SessionManager.QUERIES.UPDATE_SESSION.replace("[updatesContents]", updatesContents);
    }

    /**
     * セッションIDを保存するカラム名を取得する
     *
     * @returns {*}
     */

    private get getIdColumn(): string {
        return this.sessionIdColumn;
    }

    /**
     * テーブル名を取得する
     *
     * @private
     * @readonly
     * @type {string}
     */
    private get getTableName(): string {
        return this.tableName;
    }

    /**
     * テーブル名を設定する
     *
     * @private
     * @type {string}
     */
    private set setTableName(value: string) {
        this.tableName = value;
    }

    /**
     * カラム名の配列を取得する
     *
     * @private
     * @readonly
     * @type {string[]}
     */
    private get getColumns(): string[] {
        return this.columns;
    }

    /**
     * 自由に値を保存できるカラム名の配列を取得する
     *
     * @private
     * @readonly
     * @type {string[]}
     */
    private get getFreeColumns(): string[] {
        return this.freeColumns;
    }
}
export { SessionManager };
