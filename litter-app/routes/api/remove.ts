import { Router } from "express";
const router = Router();
import * as common from "../common.ts";

async function remove_api(body: any) {
    /*
    idとパスワードを受け取り、ユーザーを削除する。
    */
    // パラメータのチェック
    const allowedParams = ["id", "password"];
    const paramCheckResult = common.check_parameters(body, allowedParams);
    if (!paramCheckResult.result.is_success) {
        return paramCheckResult;
    }
    // 入力規則に合っているかチェック
    const validationResult = common.validation(body);
    if (!validationResult.result.is_success) {
        return validationResult;
    }
    // 認証
    const authResult = await common.is_correct(body); // パスワードが正しいかどうかを確認
    if (!authResult.result.is_success) {
        return authResult;
    }
    // ユーザー削除
    const result = await common.remove(body); // ユーザー削除
    return result;
}

router.post("/", async (req, res) => {
    // ユーザー削除
    /*
    idとパスワードを受け取り、ユーザーを削除する。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード'
    }
    */
    const remove_result = await remove_api(req.body);
    res.status(remove_result.status).json(remove_result.result);
    return;
});

export { router };
