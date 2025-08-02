import express from "express";
class SessionHandler {
    /**
     * HTTPセッションハンドラ
     * HTTPセッションの中身データの管理を行うクラス。
     * 基本staticで、express.Responseの中身データを操作するために持つ。
     *
     * @static
     * @param {express.Response} res
     * @param {string} userId
     */
    static setUserId(req: express.Request, userId: string): void {
        req.session.userId = userId;
        req.session.save();
        return;
    }
    static getUserId(req: express.Request): string {
        return req.session.userId;
    }
}

export { SessionHandler };
