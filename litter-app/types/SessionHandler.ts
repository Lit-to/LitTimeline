import type { SessionData } from "express-session";
import * as constants from "../routes/constants.ts";

class SessionHandler {
    /**
     * HTTPセッションハンドラ
     * HTTPセッションの中身データの管理を行うクラス。
     * 基本staticで、express.Responseの中身データを操作するために持つ。
     *
     * @static
     * @param {express.Response} res - Expressのレスポンスオブジェクト
     * @returns {session} - セッションデータ
     * @param {string} userId
     */
    static setUserId(sessionData: SessionData, userId: string): void {
        sessionData.userId = userId;
        return;
    }

    /**
     * ユーザIDをセッションから取得する
     * @note セッションにユーザIDが保存されていない場合は空文字列を返す。
     * @static
     * @param {SessionData} sessionData - セッションデータ
     * @returns {string} - ユーザID
     */
    static getUserId(sessionData: SessionData): string {
        if (sessionData.userId) {
            return sessionData.userId;
        }
        return constants.EMPTY_STRING;
    }

    /**
     * セッションを破棄する
     *
     * @static
     * @param {SessionData} sessionData - セッションデータ
     * @returns {void}
     */
    static destroy(sessionData: SessionData): void {
        delete sessionData.userId;
        return;
    }
}

export { SessionHandler };
