import { Router } from "express";
const router = Router();
import * as common from "../common.ts";
import * as config from "../config.ts";

async function change_password_api(body: any) {
    /*
    idと新しいパスワードを受け取り、パスワードを変更する。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード',
        new_password: '新しいパスワード'
    }    
    */
    // パラメータのチェック
    const allowedParams = ["id", "password", "new_password"];
    const paramCheckResult = common.check_parameters(body, allowedParams);
    if (!paramCheckResult.result.is_success) {
        // res.status(paramCheckResult.status).json(paramCheckResult.result);
        return paramCheckResult;
    }
    // バリデーション
    const validationResult = common.validation(body);
    if (!validationResult.result.is_success) {
        return validationResult;
    }
    // 認証
    const authResult = await common.is_correct(body); // パスワードが正しいかどうかを確認
    if (!authResult.result.is_success) {
        return authResult;
    }
    // 新パスワードのバリデーション
    if (!config.passValidPattern.test(body.new_password)) {
        return common.gen_result(false, config.BAD_REQUEST, "新しいパスワードが不正です");
    }
    // パスワード変更
    const result = await common.change_password(body);
    if (!result.result.is_success) {
        return result;
    }
    return common.gen_result(true, config.SUCCESS, "");
}

router.post("/", async (req, res) => {
    const result = await change_password_api(req.body);
    res.status(result.status).json(result.result);
});

export { router };
