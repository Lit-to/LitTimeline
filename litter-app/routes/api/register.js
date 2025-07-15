import { Router } from "express";
const router = Router();
import { check_parameters, validation, is_exist, register, init_session } from "../common";
import { BAD_REQUEST } from "../config.js";

router.post("/", async (req, res) => {
    // ユーザー登録
    /*
    idとパスワードと名前を受け取り、ユーザーを登録する。
    既にユーザが存在している場合は失敗エラーを返す。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード',
        name: '名前'
    }*/
    // パラメータのチェック
    const allowedParams = ["id", "password", "name"];
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
    // 既にいるかどうかのチェック
    const existResult = await is_exist(req.body.id);
    if (existResult.result.is_success) {
        // 既にいる場合
        res.status(BAD_REQUEST).json({
            is_success: false,
            reason: ["ユーザーが既に存在します"]
        });
        return;
    }
    // ユーザー登録
    const register_result = await register(req.body);
    if (!register_result.result.is_success) {
        // 登録に失敗した場合
        res.status(register_result.status).json(register_result.result);
        return;
    }
    // 登録に成功した場合
    let init_result = await init_session(req, req.body.id); // セッションの初期化/idと名前のデータをセッションに保存
    res.status(init_result.status).json(init_result.result);
    return;
});

export default router;
