import * as express from "express";
const router = express.Router();
import * as ResponseResult from "../../types/ResponseResult.ts";
import { SessionHandler } from "../../types/SessionHandler.ts";
import * as constants from "../constants.ts";

/**
 * セッションデータを返却するAPI
 * @note セッションに保存されているユーザーデータを返す。ない場合は空を返す。
 * @param {express.Request} req - リクエストオブジェクト(自動挿入)
 * @param {express.Response} res - レスポンスオブジェクト(自動挿入)
 * @returns {ResponseResult.ResponseResult} - 処理結果
 */
function getUserIdFromSession(req: express.Request, res: express.Response): express.Response {
    let userId = SessionHandler.getUserId(req.session);
    if (userId == undefined) {
        userId = constants.EMPTY_STRING;
        SessionHandler.setUserId(req.session, constants.EMPTY_STRING);
    }
    return ResponseResult.ResponseResult.createSuccessWithData({ userId }).formatResponse(res);
}

router.get("/", getUserIdFromSession);
export { router };
