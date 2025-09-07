import * as session from "express-session";
import * as constants from "../routes/constants.ts";
class SessionHandler {
    /**
     * HTTPセッションハンドラ
     * HTTPセッションの中身データの管理を行うクラス。
     * 基本staticで、express.Responseの中身データを操作するために持つ。
     * @static
     * @param {Express.Request} req - セッションデータ
     * @param {string} userId
     */
    static setUserId(req: Express.Request, userId: string): void {
        req.session.userId = userId;
        return;
    }

    /**
     * ユーザIDをセッションから取得する
     * @note セッションにユーザIDが保存されていない場合は空文字列を返す。
     * @static
     * @param {Express.Request} req - セッションデータ
     * @returns {string} - ユーザID
     */
    static getUserId(req: Express.Request): string {
        if (req.session.userId) {
            return req.session.userId;
        }
        return constants.EMPTY_STRING;
    }

    /**
     * セッションを破棄する
     * インスタンスごと全てnullにする
     * @static
     * @param {SessionData} sessionData - セッションデータ
     * @returns {void}
     */
    static destroy(sessionData: Express.Request): void {
        for (const key of Object.keys(this)) {
            (this as any)[key] = null;
        }
        return;
    }
}

export { SessionHandler };
