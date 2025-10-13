import * as express from "express";
import * as common from "../common.ts";
import * as User from "../../types/User.ts";
import * as ResponseResult from "../../types/ResponseResult.ts";
import * as constants from "../constants.ts";

const router = express.Router();

/**
 * idと新しいユーザーIDを受け取り、ユーザーIDを変更する。
 * @note - ユーザ認証が通らないとID変更は行われない。
 * @param {User.User} user - 変更したいユーザのオブジェクト
 * @param {string} password - ユーザーのパスワード
 * @param {string} newId - 新しいユーザーID
 * @returns {ResponseResult.ResponseResult} - 処理結果
 */
async function changeId(user: User.User, password: string, newId: string): Promise<ResponseResult.ResponseResult> {
    // 認証
    const authResult = await user.certify(password);
    if (!authResult.getIsSuccess) {
        return authResult;
    }

    // ID変更
    const changeResult = await user.changeId(newId);
    return changeResult;
}

/**
 * 名前変更APIのエントリポイント
 * @note パラメータの数とキーが一致しない場合はエラーステータスを返す。
 * @param {express.Request} req - リクエストオブジェクト(自動挿入)
 * @param {express.Response} res - レスポンスオブジェクト(自動挿入)
 */
async function changeIdHandler(req: express.Request, res: express.Response) {
    // パラメータチェック
    const allowedParams = [constants.PARAM_ID, constants.PARAM_PASSWORD, constants.PARAM_NEW_ID];
    const paramCheckResult = common.checkParameters(Object.keys(req.body), allowedParams);
    if (!paramCheckResult.getIsSuccess) {
        return paramCheckResult.formatResponse(res);
    }
    // 情報洗い出し
    const user = await User.User.createUser(req.body.id);
    const newId = req.body.newId;
    const password = req.body.password;
    // ID変更処理
    const result = await changeId(user, password, newId);

    // レスポンス生成
    return result.formatResponse(res);
}
router.post("/", changeIdHandler);
export { router };
