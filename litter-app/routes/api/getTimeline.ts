import * as express from "express";
import * as User from "../../types/User.ts";
import * as ResponseResult from "../../types/ResponseResult.ts";
import * as common from "../common.ts";
import * as constants from "../constants.ts";

const router = express.Router();
/**
 * タイムライン取得のエントリポイント
 * @note パラメータの数とキーが一致しない場合はエラーステータスを返す。
 * @param {express.Request} req - リクエストオブジェクト(自動挿入)
 * @param {express.Response} res - レスポンスオブジェクト(自動挿入)
 */
async function getTimelineHandler(req: express.Request, res: express.Response) {
    // パラメータチェック
    const allowedParams = [constants.PARAM_COUNT];
    const paramCheckResult = common.checkParameters(Object.keys(req.body), allowedParams);
    if (!paramCheckResult.getIsSuccess) {
        return paramCheckResult.formatResponse(res);
    }
    // ログイン済みか確認
    const sessionId = await common.getSessionFromCookie(req);
    const user = await User.User.createUserFromSessionId(sessionId);
    await user.activate(sessionId);
    const timelinePosts = await user.getTimeline(req.body[constants.PARAM_COUNT]);
    // レスポンス生成
    return ResponseResult.ResponseResult.createSuccessWithData(timelinePosts).formatResponse(res);
}

router.post("/", getTimelineHandler);
export { router };
