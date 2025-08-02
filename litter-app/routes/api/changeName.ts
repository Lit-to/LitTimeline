import * as express from "express";
import * as common from "../common.ts";
import * as User from "../../types/User.ts";
import * as ResponseResult from "../../types/ResponseResult.ts";
import * as constants from "../constants.ts";

const router = express.Router();

async function changeNameApi(user: User.User, password: string, newName: string): Promise<ResponseResult.ResponseResult> {
    /**
     * idと新しいユーザーIDを受け取り、ユーザーIDを変更する。
     *
     * @param {LtlTypes.User} user - 変更したいユーザのオブジェクト
     * @param {string} newId - 新しいユーザーID
     *  - 処理結果
     */

    // 認証
    const authResult = await user.certify(password);
    if (!authResult.getIsSuccess()) {
        return authResult;
    }

    // 名前変更
    const changeResult = await user.changeName(newName);
    return changeResult;
}

async function changeNameHandler(req: express.Request, res: express.Response) {
    // パラメータチェック
    /**
     * APIのエントリポイント
     * @param {express.Request} req - リクエストオブジェクト
     * @param req.body.id - ユーザーID
     * @param req.body.password - パスワード
     * @param req.body.newId - 新しいユーザーID
     *
     */
    const allowedParams = [constants.API_PARAM_ID, constants.API_PARAM_NEW_NAME, constants.API_PARAM_PASSWORD];
    const paramCheckResult = common.checkParameters(req.body, allowedParams);
    if (!paramCheckResult.getIsSuccess) {
        return paramCheckResult;
    }

    // 情報洗い出し
    const user = User.User.createUser(req.body.id);
    const newId = req.body.newId;
    const password = req.body.password;

    // 名前変更処理
    const result = await changeNameApi(user, password, newId);

    // レスポンス生成
    return result.formatResponse(res);
}

router.post("/", changeNameHandler);
export { router };
