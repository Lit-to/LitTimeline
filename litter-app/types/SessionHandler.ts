import * as constants from "../routes/constants.ts";
import * as SessionManager from "./SessionManager.ts";

class SessionHandler {
    /**
     * HTTPセッションハンドラ
     * HTTPセッションの中身データの管理を行うクラス。
     * 基本staticで、express.Responseの中身データを操作するために持つ。
     * @static
     * @param {SessionData} sessionData - セッションデータ
     * @param {string} userId
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

    static async createNewSessionWithUserId(userId: string): Promise<string> {
        const manager = SessionManager.SessionManager.getInstance();
        return await manager.createNewSession(userId);
    }

    static async createNewSession() {
        const manager = SessionManager.SessionManager.getInstance();
        const sessionId = await manager.createNewSession(constants.EMPTY_STRING);
        return sessionId;
    }
    /**
     * ユーザIDをセッションから取得する
     * @note セッションにユーザIDが保存されていない場合は空文字列を返す。
     * @static
     * @param {SessionData} sessionData - セッションデータ
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
}
export { SessionHandler };
