import * as express from "express";
const router = express.Router();
import * as ResponseResult from "../../types/ResponseResult.ts";
import * as SessionHandler from "../../types/SessionHandler.ts";
import * as constants from "../constants.ts";
import * as common from "../common.ts";

/**
 * セッションデータを返却するAPI
 * @note セッションに保存されているユーザーデータを返す。ない場合は空を返す。
 * @param {express.Request} req - リクエストオブジェクト(自動挿入)
 * @param {express.Response} res - レスポンスオブジェクト(自動挿入)
 * @returns {ResponseResult.ResponseResult} - 処理結果
 */
async function getUserIdFromSessionHandler(req: express.Request, res: express.Response): Promise<express.Response> {
    const sessionId = req.cookies[constants.COOKIE_SESSION_ID];
    const userId = await SessionHandler.SessionHandler.getUserId(sessionId);
    return ResponseResult.ResponseResult.createSuccessWithData({ userId: userId }).formatResponse(res);
}

router.get("/", getUserIdFromSessionHandler);
export { router };
