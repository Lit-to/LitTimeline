import { Router } from "express";
const router = Router();
import { check_parameters, validation, is_correct, init_session } from "../common.ts";
import { UNAUTHORIZED } from "../config.ts";

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
    // パラメータのチェック
    const allowedParams = ["id", "password"];
    const paramCheckResult = check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.is_success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // 入力チェック
    const validationResult = validation(req.body);
    if (!validationResult.result.is_success) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }

    // ユーザー認証
    const result = await is_correct(req.body);
    if (result.result.is_success) {
        // 認証がOKの場合セッションに保存してページ遷移
        let init_result = await init_session(req, req.body.id); // idと名前のデータをセッションに保存
        res.status(init_result.status).json(init_result.result);
        return;
    } else {
        result.result.reason = "ユーザーIDまたはパスワードが間違っています";
        result.result.is_success = false;
        res.status(UNAUTHORIZED).json(result.result);
        return;
    }
});

export default router;
