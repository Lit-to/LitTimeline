import * as express from "express";
import * as common from "../common.ts";
import * as User from "../../types/User.ts";
import * as ResponseResult from "../../types/ResponseResult.ts";
import * as constants from "../constants.ts";

const router = express.Router();

async function changeIdApi(user: User.User, password: string, newId: string): Promise<ResponseResult.ResponseResult> {
    /**
     * idと新しいユーザーIDを受け取り、ユーザーIDを変更する。
     *
     * @param {LtlTypes.User} user - 変更したいユーザのオブジェクト
     * @param {string} newId - 新しいユーザーID
     *  - 処理結果
     */

    // 認証
    const authResult = await user.certify(password);
    if (!authResult.getIsSuccess) {
        return authResult;
    }

    // ID変更
    const changeResult = await user.changeId(newId);
    return changeResult;
}

async function changeIdHandler(req: express.Request, res: express.Response) {
    // パラメータチェック
    /**
     * APIのエントリポイント
     * @param {express.Request} req - リクエストオブジェクト
     * @param req.body.id - ユーザーID
     * @param req.body.password - パスワード
     * @param req.body.newId - 新しいユーザーID
     *
     */

    // パラメータチェック
    const allowedParams = [constants.API_PARAM_ID, constants.API_PARAM_NEW_PASSWORD, constants.API_PARAM_NEW_ID];
    const paramCheckResult = common.checkParameters(req.body, allowedParams);
    if (!paramCheckResult.getIsSuccess) {
        return paramCheckResult;
    }

    // 情報洗い出し
    const user = User.User.createUser(req.body.id);
    const newId = req.body.newId;
    const password = req.body.password;

    // ID変更処理
    const result = await changeIdApi(user, password, newId);

    // レスポンス生成
    return result.formatResponse(res);
}
router.post("/", changeIdHandler);
export { router };
