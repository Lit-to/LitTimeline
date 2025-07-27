import { Router } from "express";
const router = Router();
import * as common from "../common.ts";
import * as config from "../config.ts";

async function login_api(body: any) {
    /*
    idをとパスワードを受け取り、ログイン処理を行う。
    成功した場合はセッションidを返却し、失敗した場合はエラーメッセージを返却する。
    入力:
    {
        id: 'ユーザーID'
        password: 'パスワード'
    }
    */
    // パラメータのチェック
    const allowedParams = ["id", "password"];
    const paramCheckResult = common.check_parameters(body, allowedParams);
    if (!paramCheckResult.result.is_success) {
        return paramCheckResult;
    }
    // 入力チェック
    const validationResult = common.validation(body);
    if (!validationResult.result.is_success) {
        return validationResult;
    }

    // ユーザー認証
    const result = await common.is_correct(body);
    if (!result.result.is_success) {
        return common.gen_result(false, config.UNAUTHORIZED, "ユーザーIDまたはパスワードが間違っています");
    }
    return common.gen_result_success();
}

router.post("/", async (req, res) => {
    /*
    idをとパスワードを受け取り、ログイン処理を行う。
    成功した場合はセッションidを返却し、失敗した場合はエラーメッセージを返却する。
    入力:
    {
        id: 'ユーザーID'
        password: 'パスワード'
    }
    */
    const result = await login_api(req.body);
    if (!result.result.is_success) {
        res.status(result.status).json(result.result);
    }
    const sessionResult = await common.init_session(req, req.body.id); // idと名前のデータをセッションに保存
    if (!sessionResult.result.is_success) {
        res.status(sessionResult.status).json(sessionResult.result);
    }
    res.status(result.status).json(result.result);
    return;
});

export { router };
