import * as express from "express";
const router = express.Router();
import * as ResponseResult from "../../types/ResponseResult.ts";
import * as SessionManager from "../../types/SessionManager.ts";
import * as constants from "../constants.ts";
import * as common from "../common.ts";
async function getUserIdFromSession(sessionId: string): Promise<ResponseResult.ResponseResult> {
    const sessionManager = SessionManager.SessionManager.getInstance();
    const sessionData = await sessionManager.getSessionFromSessionId(sessionId);
    if (!sessionData.getIsSuccess) {
        return;
    }
    let userId = sessionData.getResult[constants.SESSION_USER_ID];
    if (userId == undefined) {
        userId = constants.EMPTY_STRING;
        sessionData[constants.SESSION_USER_ID] = userId;
    }
    return ResponseResult.ResponseResult.createSuccessWithData({ userId });
}

/**
 * セッションデータを返却するAPI
 * @note セッションに保存されているユーザーデータを返す。ない場合は空を返す。
 * @param {express.Request} req - リクエストオブジェクト(自動挿入)
 * @param {express.Response} res - レスポンスオブジェクト(自動挿入)
 * @returns {ResponseResult.ResponseResult} - 処理結果
 */
async function getUserIdFromSessionHandler(req: express.Request, res: express.Response): Promise<express.Response> {
    // パラメータチェック
    const allowedParams = [constants.PARAM_SESSION_ID];
    const paramCheckResult = common.checkParameters(Object.keys(req.query), allowedParams);
    if (!paramCheckResult.getIsSuccess) {
        return paramCheckResult.formatResponse(res);
    }
    // セッションIDの取得
    const sessionId = req.query.sessionId as string;
    // セッションデータの取得
    const result = await getUserIdFromSession(sessionId);
    return result.formatResponse(res);
}

router.get("/", getUserIdFromSessionHandler);
export { router };
