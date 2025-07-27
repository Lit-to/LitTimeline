import { Router } from "express";
const router = Router();
import * as common from "../common.ts";

router.post("/", async (req, res) => {
    /*
    idを受け取り、ユーザーが存在するかどうかを返す。
    入力:
    {
        id: 'ユーザーID'
    }
    */
    // パラメータのチェック
    const allowedParams = ["id"];
    const paramCheckResult = common.check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.is_success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // 入力チェック
    const validationResult = common.validation(req.body);
    if (!validationResult.result.is_success) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }

    // ユーザーが存在するかどうかを確認
    // 本来ユーザが存在するか否かを返すべきだが、性質上｢いない｣場合に注目しているので逆転させている
    const result = await common.is_exist(req.body.id);
    if (result.result.is_success) {
        result.result.reason = "ユーザーが既に存在します";
        result.result.is_success = false;
    } else {
        result.result.reason = "";
        result.result.is_success = true;
    }
    res.status(result.status).json(result.result);
    return;
});

export { router };
