import * as express from "express";
import * as common from "../common.ts";
import * as User from "../../types/User.ts";
import * as ResponseResult from "../../types/ResponseResult.ts";
import * as constants from "../constants.ts";

const router = express.Router();

/**
 * パスワードを変更するAPI
 *
 * @async
 * @param {User.User} user - ユーザーオブジェクト
 * @param {string} password - 現在のパスワード
 * @param {string} newPassword - 新しいパスワード
 * @returns {Promise<ResponseResult.ResponseResult>} - クエリ結果オブジェクト
 */
async function changePassword(user: User.User, password: string, newPassword: string): Promise<ResponseResult.ResponseResult> {
    // 認証
    const authResult = await user.certify(password);
    if (!authResult.getIsSuccess) {
        return authResult;
    }
    // パスワード変更
    const changeResult = await user.changePassword(newPassword);
    return changeResult;
}

/**
 * パスワード変更APIのエントリポイント
 * @note パラメータの数とキーが一致しない場合はエラーステータスを返す。
 * @param {express.Request} req - リクエストオブジェクト(自動挿入)
 * @param {express.Response} res - レスポンスオブジェクト(自動挿入)
 * @returns {ResponseResult.ResponseResult} - 処理結果
 *
 */
async function changePasswordHandler(req: express.Request, res: express.Response): Promise<express.Response> {
    // パラメータチェック

    // パラメータチェック
    const allowedParams = [constants.PARAM_ID, constants.PARAM_PASSWORD, constants.PARAM_NEW_PASSWORD];
    const paramCheckResult = common.checkParameters(Object.keys(req.body), allowedParams);
    if (!paramCheckResult.getIsSuccess) {
        return paramCheckResult.formatResponse(res);
    }

    // 情報洗い出し
    const user = await User.User.createUser(req.body.id);
    const newPassword = req.body.newPassword;
    const password = req.body.password;

    // パスワード変更処理
    const result = await changePassword(user, password, newPassword);

    // レスポンス生成
    return result.formatResponse(res);
}

router.post("/", changePasswordHandler);
export { router };
