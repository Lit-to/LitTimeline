import { Router } from "express";
const router = Router();
import * as common from "../common.ts";

async function is_not_exist_api(body: any) {
    // パラメータのチェック
    const allowedParams = ["id"];
    const paramCheckResult = common.check_parameters(body, allowedParams);
    if (!paramCheckResult.result.is_success) {
        return paramCheckResult;
    }
    // バリデーション
    const validationResult = common.validation(body.id, body.password);
    if (!validationResult.result.is_success) {
        return validationResult;
    }

    // ユーザーが存在するかどうかを確認
    const result = await common.authUser(body.id, body.password);
    if (result.result.is_success) {
        result.result.reason = "ユーザーが既に存在します";
        result.result.is_success = false;
    } else {
        result.result.reason = "";
        result.result.is_success = true;
    }
    return result;
}

router.post("/", async (req, res) => {
    /*
    idを受け取り、ユーザーが存在するかどうかを返す。
    入力:
    {
        id: 'ユーザーID'
    }
    */
    // パラメータのチェック
    const result = await is_not_exist_api(req.body);
    res.status(result.status).json(result.result);
    return;
});

export { router };
