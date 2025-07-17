import { Router } from "express";
const router = Router();
import { check_parameters, validation, is_correct, change_name } from "../common.js";

router.post("/", async (req, res) => {
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
    const paramCheckResult = check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.is_success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const validationResult = validation(req.body);
    if (!validationResult.result.is_success) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // パスワードが正しいかどうかを確認
    const authResult = await is_correct(req.body); // パスワードが正しいかどうかを確認
    if (!authResult.result.is_success) {
        res.status(authResult.status).json(authResult.result);
        return;
    }
    // 名前変更
    const result = await change_name(req.body);
    res.status(result.status).json(result.result);
    return;
});

export default router;
