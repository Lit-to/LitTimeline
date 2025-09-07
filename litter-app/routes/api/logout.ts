import * as express from "express";
import * as sessionHandler from "../../types/SessionHandler.ts";
const router = express.Router();
import * as common from "../common.ts";
import * as constants from "../constants.ts";
import { ResponseResult } from "../../types/ResponseResult.ts";

/**
 * ログアウト処理を行う。
 * @note 成功した場合はセッションを破棄し、失敗した場合はエラーメッセージを返却する。
 * @note - パラメータの数とキーが一致しない場合はエラーステータスを返す。
 * @async
 * @param {express.Request} req - リクエストオブジェクト
 * @param {express.Response} res - レスポンスオブジェクト
 * @returns {Promise<express.Response>} - ログアウト処理の結果
 */
async function logoutHandler(req: express.Request, res: express.Response): Promise<express.Response> {
    /*
    ログアウト処理を行う。
    具体的にはセッションを破棄する。

    */
    // パラメータのチェック
    sessionHandler.SessionHandler.destroy(req);
    return ResponseResult.createSuccess().formatResponse(res);
}

router.post("/", logoutHandler);

export { router };
