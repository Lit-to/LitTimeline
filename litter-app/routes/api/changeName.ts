import * as express from "express";
import * as common from "../common.ts";
import * as User from "../../types/User.ts";
import * as ResponseResult from "../../types/ResponseResult.ts";
import * as constants from "../constants.ts";

const router = express.Router();

/**
 * idに紐づくユーザー名を変更する。
 *
 * @note - ユーザ認証が通らないと名前変更は行われない。
 * @param {User.User} user - 変更したいユーザのオブジェクト
 * @param {string} password - ユーザーのパスワード
 * @param {string} newName - 新しいユーザー名
 * @returns {ResponseResult.ResponseResult} - 処理結果
 */
async function changeName(user: User.User, password: string, newName: string): Promise<ResponseResult.ResponseResult> {
    // 認証
    const authResult = await user.certify(password);
    if (!authResult.getIsSuccess) {
        return authResult;
    }

    // 名前変更
    const changeResult = await user.changeName(newName);
    return changeResult;
}

// パラメータチェック
/**
 * 名前変更APIのエントリポイント
 * @note パラメータの数とキーが一致しない場合はエラーステータスを返す。
 * @param {express.Request} req - リクエストオブジェクト(自動挿入)
 * @param {express.Response} res - レスポンスオブジェクト(自動挿入)
 * @returns {ResponseResult.ResponseResult} - 処理結果
 */
async function changeNameHandler(req: express.Request, res: express.Response): Promise<express.Response> {
    // パラメータチェック
    const allowedParams = [constants.PARAM_ID, constants.PARAM_PASSWORD, constants.PARAM_NEW_NAME];
    const paramCheckResult = common.checkParameters(req.body, allowedParams);
    if (!paramCheckResult.getIsSuccess) {
        return paramCheckResult.formatResponse(res);
    }

    // 情報洗い出し
    const user = await User.User.createUser(req.body.id);
    const newName = req.body.newName;
    const password = req.body.password;

    // 名前変更処理
    const result = await changeName(user, password, newName);

    // レスポンス生成
    return result.formatResponse(res);
}
router.post("/", changeNameHandler);
export { router };
