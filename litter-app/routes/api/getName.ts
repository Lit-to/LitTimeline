import * as express from "express";
import * as User from "../../types/User.ts";
import * as ResponseResult from "../../types/ResponseResult.ts";
import * as common from "../common.ts";
import * as constants from "../constants.ts";

const router = express.Router();
/**
 * idに紐づくユーザー名を取得する。
 *
 * @param id - ユーザーID
 * @returns {ResponseResult.ResponseResult} - 処理結果
 */
function getName(user: User.User): string {
    return user.getName;
}

/**
 * 名前取得APIのエントリポイント
 * @note パラメータの数とキーが一致しない場合はエラーステータスを返す。
 * @param {express.Request} req - リクエストオブジェクト(自動挿入)
 * @param {express.Response} res - レスポンスオブジェクト(自動挿入)
 */
async function getNameHandler(req: express.Request, res: express.Response) {
    // パラメータチェック
    const allowedParams = [constants.PARAM_ID];
    const paramCheckResult = common.checkParameters(Object.keys(req.body), allowedParams);
    if (!paramCheckResult.getIsSuccess) {
        return paramCheckResult.formatResponse(res);
    }
    // 情報洗い出し
    const user = await User.User.createUser(req.body.id);
    if (!user.getIsValid) {
        return ResponseResult.ResponseResult.createFailed(constants.BAD_REQUEST, constants.MESSAGE_UNKNOWN_USER).formatResponse(res);
    }
    // ユーザー名変更処理
    const userName = getName(user);
    // レスポンス生成
    return ResponseResult.ResponseResult.createSuccessWithData({ name: userName }).formatResponse(res);
}

router.post("/", getNameHandler);
export { router };
