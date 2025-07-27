import { Router } from "express";
const router = Router();
import * as common from "../common.ts";

async function change_id_api(body: any) {
    // 名前変更
    /*
    idと新しい名前を受け取り、名前を変更する。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード',
        new_name: '新しい名前'
    }
    */
    // パラメータのチェック
    const allowedParams = ["id", "password", "new_name"];
    const paramCheckResult = common.check_parameters(body, allowedParams);
    if (!paramCheckResult.result.is_success) {
        return paramCheckResult;
    }
    // バリデーション
    const validationResult = common.validation(body);
    if (!validationResult.result.is_success) {
        return validationResult;
    }
    // パスワードが正しいかどうかを確認
    const authResult = await common.is_correct(body); // パスワードが正しいかどうかを確認
    if (!authResult.result.is_success) {
        return authResult;
    }
    // 名前変更
    return await common.change_name(body);
}

router.post("/", async (req, res) => {
    const result = await change_id_api(req.body);
    res.status(result.status).json(result.result);
});

export { router };
