import * as express from "express";
const router = express.Router();
import * as common from "../common.ts";
import * as constants from "../constants.ts";
import * as ResponseResult from "../../types/ResponseResult.ts";
import * as sessionManager from "../../types/SessionManager.ts";
import * as User from "../../types/User.ts";

/**
 * idとパスワードを受け取り、ログイン処理を行う。
 * @note 成功した場合はセッションidを返却し、失敗した場合はエラーメッセージを返却する。
 * @async
 * @param {string} id - ユーザーID
 * @param {string} password - ユーザーパスワード
 * @param {express.Request} req - リクエストオブジェクト
 * @returns {Promise<ResponseResult.ResponseResult>}  - ログイン処理の結果
 */
async function login(id: string, password: string, req: express.Request): Promise<ResponseResult.ResponseResult> {
    /* パスワード認証 */
    const user = await User.User.createUser(id);
    const certifyResult = await user.certify(password);
    if (!certifyResult.getIsSuccess) {
        return certifyResult;
    }

    /* セッションにユーザーidを保存 */
    const sessionHandler = sessionManager.SessionManager.getInstance();
    const sessionId = await sessionHandler.createNewSession(id);
    let sessionDataQueryResult = await sessionHandler.getSessionFromSessionId(sessionId);
    if (!sessionDataQueryResult.getIsSuccess) {
        return ResponseResult.ResponseResult.createFailed(constants.INTERNAL_SERVER_ERROR, constants.MESSAGE_INTERNAL_SERVER_ERROR);
    }
    let sessionData = sessionDataQueryResult.getResult;
    sessionData[constants.SESSION_USER_ID] = id;
    sessionData[constants.IS_LOGGED_IN] = constants.TRUE;
    sessionHandler.saveSession(sessionData);

    return certifyResult;
}

/**
 * ログインAPIのエントリポイント
 * @note パラメータの数とキーが一致しない場合はエラーステータスを返す。
 * @param {express.Request} req - リクエストオブジェクト(自動挿入)
 * @param {express.Response} res - レスポンスオブジェクト(自動挿入)
 * @returns {ResponseResult.ResponseResult} - 処理結果
 */
async function loginHandler(req: express.Request, res: express.Response): Promise<express.Response> {
    // パラメータのチェック
    const allowedParams = [constants.PARAM_ID, constants.PARAM_PASSWORD];
    const paramCheckResult = common.checkParameters(Object.keys(req.body), allowedParams);
    if (!paramCheckResult.getIsSuccess) {
        return paramCheckResult.formatResponse(res);
    }
    // ログイン処理
    const result = await login(req.body.id, req.body.password, req);
    return result.formatResponse(res);
}

router.post("/", loginHandler);

export { router };
