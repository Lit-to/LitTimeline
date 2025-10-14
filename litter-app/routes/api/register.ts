import express from "express";
const router = express.Router();
import * as common from "../common.ts";
import * as constants from "../constants.ts";
import { User } from "../../types/User.ts";
import * as ResponseResult from "../../types/ResponseResult.ts";
import * as SessionManager from "../../types/SessionManager.ts";
/**
 * ユーザ登録API
 * @async
 * @note ユーザIDとパスワードと名前を受け取り、DBにユーザを挿入する。
 * @note - パラメータの数とキーが一致しない場合はエラーステータスを返す。
 * @param {string} id - ユーザーID
 * @param {string} password - パスワード
 * @param {string} name - 名前
 * @returns {Promise<ResponseResult.ResponseResult>} - ユーザ登録の結果
 */
async function register(id: string, password: string, name: string, req: Express.Request): Promise<ResponseResult.ResponseResult> {
    //ユーザオブジェクトを作成
    const user = await User.createUser(id);
    if (!user.getIsValid) {
        return ResponseResult.ResponseResult.createFailed(constants.BAD_REQUEST, constants.MESSAGE_ID_INVALID);
    }
    // 入力規則に合っているかチェック
    let registerResult = await user.register(name, password);
    /* セッションにユーザーidを保存 */
    if (registerResult.getIsSuccess) {
        const sessionManager = SessionManager.SessionManager.getInstance();
        const sessionId = await sessionManager.createNewSession(id);
        let sessionDataQueryResult = await sessionManager.getSessionFromSessionId(sessionId);
        if (!sessionDataQueryResult.getIsSuccess) {
            return ResponseResult.ResponseResult.createFailed(constants.INTERNAL_SERVER_ERROR, constants.MESSAGE_INTERNAL_SERVER_ERROR);
        }
        let sessionData = sessionDataQueryResult.getResult;
        sessionData[constants.SESSION_USER_ID] = id;
        sessionData[constants.IS_LOGGED_IN] = constants.TRUE;
        sessionManager.saveSession(sessionData);
        registerResult = ResponseResult.ResponseResult.createSuccessWithData({ sessionId: sessionId });
    }
    return registerResult;
}

/**
 * ユーザ登録APIのエントリポイント
 * @note パラメータの数とキーが一致しない場合はエラーステータスを返す。
 * @async
 * @param {express.Request} req - リクエストオブジェクト(自動挿入)
 * @param {express.Response} res - レスポンスオブジェクト(自動挿入)
 * @returns {Promise<express.Response>} - レスポンスオブジェクト
 */
async function registerHandler(req: express.Request, res: express.Response) {
    // パラメータのチェック
    const allowedParams = [constants.PARAM_ID, constants.PARAM_PASSWORD, constants.PARAM_NAME];
    const paramCheckResult = common.checkParameters(Object.keys(req.body), allowedParams);
    if (!paramCheckResult.getIsSuccess) {
        return paramCheckResult.formatResponse(res);
    }
    const registerResult = await register(req.body.id, req.body.password, req.body.name, req);
    return registerResult.formatResponse(res);
}

router.post("/", registerHandler);

export { router };
