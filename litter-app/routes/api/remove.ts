import * as express from "express";
const router = express.Router();
import * as common from "../common.ts";
import * as constants from "../constants.ts";
import * as ResponseResult from "../../types/ResponseResult.ts";
import * as User from "../../types/User.ts";
import { idValidPattern } from "../config.ts";

async function remove(id: string, password: string): Promise<ResponseResult.ResponseResult> {
    /*
    idとパスワードを受け取り、ユーザーを削除する。
    */
    // ユーザオブジェクトを作成
    const user = User.User.createUser(id);
    if (!user.getIsValid) {
        return ResponseResult.createFailed(constants.BAD_REQUEST, constants.INVALID_ID_MESSAGE);
    }
    // 認証
    const authResult = await user.certify(password); // パスワードが正しいかどうかを確認
    if (!authResult.getIsSuccess()) {
        return authResult;
    }
    // ユーザー削除
    const result = await user.remove(); // ユーザー削除
    return result;
}

async function removeHandler(req: express.Request, res: express.Response) {
    // パラメータのチェック
    const allowedParams = [constants.API_PARAM_ID, constants.API_PARAM_PASSWORD];
    const paramCheckResult = common.check_parameters(req.body, allowedParams);
    if (!paramCheckResult.getIsSuccess()) {
        return paramCheckResult;
    }

    // ユーザー削除処理
    const removeResult = await remove(req.body.id, req.body.password);
    return removeResult.formatResponse(res);
}

router.post("/", removeHandler);

export { router };
