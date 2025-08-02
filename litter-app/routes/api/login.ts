import * as express from "express";
const router = express.Router();
import * as common from "../common.ts";
import * as config from "../config.ts";
import * as constants from "../constants.ts";
import * as ResponseResult from "../../types/ResponseResult.ts";
import { SessionHandler } from "../../types/SessionHandler.ts";
import * as User from "../../types/User.ts";

async function login(id: string, password: string, res: express.Response): Promise<ResponseResult.ResponseResult> {
    /*
    idとパスワードを受け取り、ログイン処理を行う。
    同時にresponseオブジェクトを受け取り、セッションにユーザーid情報を保存する。
    成功した場合はセッションidを返却し、失敗した場合はエラーメッセージを返却する。
    入力:
    {
        id: 'ユーザーID'
        password: 'パスワード'
    }
    */
    /* パスワード認証 */
    const user = User.User.createUser(id);
    const certifyResult = await user.certify(password);
    if (!certifyResult.getIsSuccess) {
        return certifyResult.formatResponse(res);
    }
    /* セッションにユーザーidを保存 */
    SessionHandler.setUserId(res, id); // idと名前のデータをセッションに保存
    return certifyResult.formatResponse(res);
}

async function loginHandler(req: express.Request, res: express.Response) {
    /*
    idとパスワードを受け取り、ログイン処理を行う。
    成功した場合はセッションidを返却し、失敗した場合はエラーメッセージを返却する。
    入力:
    {
        id: 'ユーザーID'
        password: 'パスワード'
    }
    */
    // パラメータのチェック
    const allowedParams = [constants.API_PARAM_ID, constants.API_PARAM_PASSWORD];
    const paramCheckResult = common.checkParameters(req.body, allowedParams);
    if (!paramCheckResult.getIsSuccess) {
        return paramCheckResult;
    }

    const result = await login(req.body.id, req.body.password, res);
    return result.formatResponse(res);
}

router.post("/", loginHandler);

export { router };
