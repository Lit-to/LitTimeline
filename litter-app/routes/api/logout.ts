import * as express from "express";
import * as session from "../../types/SessionHandler.ts";
import * as sessionHandler from "../../types/SessionHandler.ts";
const router = express.Router();
import * as common from "../common.ts";
import * as constants from "../constants.ts";


/**
 * idとパスワードを受け取り、ログアウト処理を行う。
 * @note 成功した場合はセッションを破棄し、失敗した場合はエラーメッセージを返却する。
 * @note - パラメータの数とキーが一致しない場合はエラーステータスを返す。
 * @async
 * @param {express.Request} req - リクエストオブジェクト
 * @param req.body.id - ユーザーID
 * @param {express.Response} res - レスポンスオブジェクト
 * @returns {Promise<express.Response>} - ログアウト処理の結果
 */
async function logoutHandler(req: express.Request, res: express.Response): Promise<express.Response> {
    /*
    idとパスワードを受け取り、ログアウト処理を行う。
    具体的にはセッションを破棄する。

    */
    // パラメータのチェック
    const allowedParams = [constants.PARAM_ID, constants.PARAM_PASSWORD];
    const paramCheckResult = common.checkParameters(req.body, allowedParams);
    if (!paramCheckResult.getIsSuccess) {
        return paramCheckResult.formatResponse(res);
    }
    sessionHandler.SessionHandler.destroy(req.session);
    return paramCheckResult.formatResponse(res);
}

router.post("/", logoutHandler);

export { router };
