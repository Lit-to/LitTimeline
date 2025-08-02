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
    static setUserId(res: express.Response, userId: string): void {
        res.session.userId = userId;
        res.session.save();
        return;
    }
    static getUserId(req: express.Request): any {
        return req.session.userId;
    }
}

export { SessionHandler };
