import { Router } from "express";
const router = Router();
import * as common from "../common.ts";
import * as config from "../config.ts";

async function register_api(body: any) {
    /*
    idとパスワードと名前を受け取り、ユーザーを登録する。
    既にユーザが存在している場合は失敗エラーを返す。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード',
        name: '名前'
    }
    */
    // パラメータのチェック
    const allowedParams = ["id", "password", "name"];
    const paramCheckResult = common.check_parameters(body, allowedParams);
    if (!paramCheckResult.result.is_success) {
        return paramCheckResult;
    }
    // 入力規則に合っているかチェック
    const validationResult = common.validation(body);
    if (!validationResult.result.is_success) {
        return validationResult;
    }
    // 既にいるかどうかのチェック
    const existResult = await common.is_exist(body.id);
    if (existResult.result.is_success) {
        // 既にいる場合
        return common.gen_result(false, config.BAD_REQUEST, "ユーザーが既に存在します");
    }
    // ユーザー登録
    const register_result = await common.register(body);
    if (!register_result.result.is_success) {
        // 登録に失敗した場合
        return register_result;
    }
    return common.gen_result_success();
}

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
    const register_result = await register_api(req.body);
    if (!register_result.result.is_success) {
        res.status(register_result.status).json(register_result.result);
        return;
    }
    let init_result = await common.init_session(req, req.body.id); // セッションの初期化/idと名前のデータをセッションに保存
    res.status(init_result.status).json(init_result.result);
    return;
});

export { router };
