import * as constants from "../routes/constants.ts";
import * as SessionManager from "./SessionManager.ts";

class SessionHandler {
    /**
     * HTTPセッションハンドラ
     * HTTPセッションの中身データの管理を行うクラス。
     * 基本staticで、express.Responseの中身データを操作するために持つ。
     * @static
     * @param {SessionData} sessionId - セッションID
     * @param {string} userId - ユーザーID
     * @returns {Promise<void>} - セッションにユーザIDを設定する
     */
    static async setUserId(sessionId: string, userId: string): Promise<void> {
        const manager = SessionManager.SessionManager.getInstance();
        const sessionDataQueryResult = await manager.getSessionFromSessionId(sessionId);
        const sessionData = sessionDataQueryResult.getResult;
        if (sessionDataQueryResult.getIsSuccess) {
            sessionData.set(constants.SESSION_USER_ID, userId);
            manager.saveSession(sessionData);
        }
        await manager.createNewSession(userId);
    }

    /**
     * ユーザーidを渡して新規セッションを発行
     *
     * @static
     * @async
     * @param {string} userId - ユーザーID
     * @returns {Promise<string>} - 新規セッションID
     */
    static async createNewSessionWithUserId(userId: string): Promise<string> {
        const manager = SessionManager.SessionManager.getInstance();
        return await manager.createNewSession(userId);
    }

    /**
     * 新規セッションを発行
     *
     * @static
     * @async
     * @returns {Promise<string>} - 新規セッションID
     */
    static async createNewSession(): Promise<string> {
        const manager = SessionManager.SessionManager.getInstance();
        const sessionId = await manager.createNewSession(constants.EMPTY_STRING);
        return sessionId;
    }
    /**
     * ユーザIDをセッションから取得する
     * @note セッションにユーザIDが保存されていない場合は空文字列を返す。
     * @static
     * @param {SessionData} sessionId - セッションID
     * @returns {string} - ユーザID
     */
    static async getUserId(sessionId: string): Promise<string> {
        const sessionDataQueryResult = await SessionManager.SessionManager.getInstance().getSessionFromSessionId(sessionId);
        if (!sessionDataQueryResult.getIsSuccess) {
            return constants.EMPTY_STRING;
        }
        const sessionData = sessionDataQueryResult.getResult;
        return sessionData.get(constants.SESSION_USER_ID);
    }

    /**
     * ログイン済みかどうかをDBから取得する
     *
     * @static
     * @async
     * @param {string} sessionId - セッションID
     * @returns {Promise<boolean>} - ログイン済みかどうか
     */
    static async getIsLoggedIn(sessionId: string): Promise<boolean> {
        const sessionDataQueryResult = await SessionManager.SessionManager.getInstance().getSessionFromSessionId(sessionId);
        if (!sessionDataQueryResult.getIsSuccess) {
            return false;
        }
        const sessionData = sessionDataQueryResult.getResult;
        return sessionData.get(constants.SESSION_IS_LOGGED_IN) === "1";
    }

    /**
     * ログイン済みにする
     *
     * @static
     * @async
     * @param {string} sessionId - セッションID
     * @returns {Promise<boolean>} - 成功したかどうか
     */
    static async setIsLoggedIn(sessionId: string): Promise<boolean> {
        const sessionDataQueryResult = await SessionManager.SessionManager.getInstance().getSessionFromSessionId(sessionId);
        if (!sessionDataQueryResult.getIsSuccess) {
            return false;
        }
        const sessionData = sessionDataQueryResult.getResult;
        sessionData.set(constants.SESSION_IS_LOGGED_IN, "1");
        await SessionManager.SessionManager.getInstance().saveSession(sessionData);
        return true;
    }

    /**
     * 現在表示されているポストidの取得
     *
     * @static
     * @async
     * @param {string} sessionId
     * @returns {Promise<number>}
     */
    static async getLastTimelinePostId(sessionId: string): Promise<number> {
        const sessionDataQueryResult = await SessionManager.SessionManager.getInstance().getSessionFromSessionId(sessionId);
        if (!sessionDataQueryResult.getIsSuccess) {
            return 0;
        }
        const sessionData = sessionDataQueryResult.getResult;
        return Number(sessionData.get(constants.LAST_TIMELINE_POST_ID));
    }

    /**
     * 現在表示されているポストidの更新
     *
     * @static
     * @async
     * @param {string} sessionId
     * @param {number} postId
     * @returns {Promise<boolean>}
     */
    static async setLastTimelinePostId(sessionId: string, postId: number): Promise<boolean> {
        const sessionDataQueryResult = await SessionManager.SessionManager.getInstance().getSessionFromSessionId(sessionId);
        if (!sessionDataQueryResult.getIsSuccess) {
            return false;
        }
        const sessionData = sessionDataQueryResult.getResult;
        sessionData.set(constants.LAST_TIMELINE_POST_ID, String(postId));
        await SessionManager.SessionManager.getInstance().saveSession(sessionData);
        return true;
    }
}
export { SessionHandler };
