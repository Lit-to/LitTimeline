import * as express from "express";
import * as common from "../common.ts";
import * as User from "../../types/User.ts";
import * as ResponseResult from "../../types/ResponseResult.ts";
import * as constants from "../constants.ts";

const router = express.Router();

async function changePassword(user: User.User, password: string, newPassword: string): Promise<ResponseResult.ResponseResult> {
    /**
     * idと新しいユーザーIDを受け取り、ユーザーIDを変更する。
     *
     * @param {LtlTypes.User} user - 変更したいユーザのオブジェクト
     * @param {string} password - ユーザーのパスワード
     * @param {string} newPassword - 新しいパスワード
     *  - 処理結果
     */

    // 認証
    const authResult = await user.certify(password);
    if (!authResult.getIsSuccess) {
        return authResult;
    }

    // パスワード変更
    const changeResult = await user.changePassword(newPassword);
    return changeResult;
}

async function changePasswordHandler(req: express.Request, res: express.Response) {
    // パラメータチェック
    /**
     * APIのエントリポイント
     * @param {express.Request} req - リクエストオブジェクト
     * @param req.body.id - ユーザーID
     * @param req.body.password - パスワード
     * @param req.body.newPassword - 新しいパスワード
     *
     */

    // パラメータチェック
    const allowedParams = [constants.API_PARAM_ID, constants.API_PARAM_PASSWORD, constants.API_PARAM_NEW_PASSWORD];
    const paramCheckResult = common.checkParameters(req.body, allowedParams);
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
