import { Router } from "express";
const router = Router();
import * as common from "../common.ts";

async function is_correct_api(body: any) {
    // パラメータのチェック
    const allowedParams = ["id", "password"];
    const paramCheckResult = common.check_parameters(body, allowedParams);
    if (!paramCheckResult.result.is_success) {
        return paramCheckResult;
    }
    // バリデーション
    const result = await common.authUser(body.id, body.password); // パスワードが正しいかどうかを確認
    return result;
}

router.post("/", async (req, res) => {
    /*
    idとパスワードを受け取り、パスワードが正しいかどうかを返す。
    パスワードはマスクし、認証を行う。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード'
    }
    */
    const result = await is_correct_api(req.body);
    if (result.result.is_success) {
        result.result.reason = "";
    }
    res.status(result.status).json(result.result);
    return;
});

export { router };
