import * as express from "express";
import * as User from "../../types/User.ts";
import * as ResponseResult from "../../types/ResponseResult.ts";
import * as common from "../common.ts";
import * as constants from "../constants.ts";
import * as SessionHandler from "../../types/SessionHandler.ts";

const router = express.Router();
/**
 * 名前取得APIのエントリポイント
 * @note パラメータの数とキーが一致しない場合はエラーステータスを返す。
 * @param {express.Request} req - リクエストオブジェクト(自動挿入)
 * @param {express.Response} res - レスポンスオブジェクト(自動挿入)
 */
async function addPostHandler(req: express.Request, res: express.Response) {
    // パラメータチェック
    const allowedParams = [constants.PARAM_ID, constants.PARAM_CONTENT];
    const paramCheckResult = common.checkParameters(req.body, allowedParams);
    if (!paramCheckResult.getIsSuccess) {
        return paramCheckResult.formatResponse(res);
    }
    // ログイン済みか確認
    // if (!SessionHandler.SessionHandler.isLoggedIn()) {
    // return ResponseResult.ResponseResult.createFailed(constants.UNAUTHORIZED, constants.MESSAGE_UNAUTHORIZED);
    // }
    const user = await User.User.createUser(req.body.id);
    if (!user.getIsValid) {
        return ResponseResult.ResponseResult.createFailed(constants.BAD_REQUEST, constants.MESSAGE_UNKNOWN_USER).formatResponse(res);
    }
    // レスポンス生成
    return ResponseResult.ResponseResult.createSuccess().formatResponse(res);
}

router.post("/", addPostHandler);
export { router };
