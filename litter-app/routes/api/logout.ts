import * as express from "express";
import * as sessionManager from "../../types/SessionManager.ts";
import * as constants from "../constants.ts";
import * as common from "../common.ts";
const router = express.Router();
import { ResponseResult } from "../../types/ResponseResult.ts";

/**
 * ログアウト処理を行う。
 * クライアントが持つセッション情報を破棄する。
 * @note 成功した場合はセッションを破棄し、失敗した場合はエラーメッセージを返却する。
 * @note - パラメータの数とキーが一致しない場合はエラーステータスを返す。
 * @async
 * @param {express.Request} req - リクエストオブジェクト
 * @param {express.Response} res - レスポンスオブジェクト
 * @returns {Promise<express.Response>} - ログアウト処理の結果
 */
async function logout(req: express.Request, res: express.Response): Promise<express.Response> {
    // ログアウト処理
    res.clearCookie(constants.COOKIE_SESSION_ID);
    return ResponseResult.createSuccess().formatResponse(res);
}

router.post("/", logout);

export { router };
