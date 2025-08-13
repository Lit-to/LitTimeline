import * as express from "express";
const router = express.Router();
import * as common from "../common.ts";
import * as constants from "../constants.ts";
import * as ResponseResult from "../../types/ResponseResult.ts";
import * as User from "../../types/User.ts";

/**
 * ユーザーを削除するAPI
 * @note ユーザーIDとパスワードを受け取り、ユーザーを削除する。
 *
 * @async
 * @param {string} id - ユーザーID
 * @param {string} password - パスワード
 * @returns {Promise<ResponseResult.ResponseResult>} - ユーザー削除の結果
 */
async function remove(id: string, password: string): Promise<ResponseResult.ResponseResult> {
    /*
    idとパスワードを受け取り、ユーザーを削除する。
    */
    // ユーザオブジェクトを作成
    const user = await User.User.createUser(id);
    if (!user.getIsValid) {
        return ResponseResult.ResponseResult.createFailed(constants.BAD_REQUEST, constants.MESSAGE_ID_INVALID);
    }
    // 認証
    const authResult = await user.certify(password); // パスワードが正しいかどうかを確認
    if (!authResult.getIsSuccess) {
        return authResult;
    }
    // ユーザー削除
    const result = await user.remove(); // ユーザー削除
    return result;
}

/**
 * ユーザー削除APIのエントリポイント
 * @note パラメータの数とキーが一致しない場合はエラーステータスを返す。
 * @async
 * @param {express.Request} req - リクエストオブジェクト(自動挿入)
 * @param {express.Response} res - レスポンスオブジェクト(自動挿入)
 * @returns {express.Response} - レスポンスオブジェクト
 */
async function removeHandler(req: express.Request, res: express.Response) {
    // パラメータのチェック
    const allowedParams = [constants.PARAM_ID, constants.PARAM_PASSWORD];
    const paramCheckResult = common.checkParameters(req.body, allowedParams);
    if (!paramCheckResult.getIsSuccess) {
        return paramCheckResult;
    }

    // ユーザー削除処理
    const removeResult = await remove(req.body.id, req.body.password);
    return removeResult.formatResponse(res);
}

router.post("/", removeHandler);
export { router };
