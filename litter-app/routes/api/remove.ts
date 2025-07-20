import { Router } from "express";
const router = Router();
import { check_parameters, validation, is_correct, remove } from "../common.ts";

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
    // パラメータのチェック
    const allowedParams = ["id", "password"];
    const paramCheckResult = check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.is_success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // 入力規則に合っているかチェック
    const validationResult = validation(req.body);
    if (!validationResult.result.is_success) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // 認証
    const authResult = await is_correct(req.body); // パスワードが正しいかどうかを確認
    if (!authResult.result.is_success) {
        res.status(authResult.status).json(authResult.result);
        return;
    }
    // ユーザー削除
    const result = await remove(req.body); // ユーザー削除
    res.status(result.status).json(result.result);
    return;
});

export default router;
