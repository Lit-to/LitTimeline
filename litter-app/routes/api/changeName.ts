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
    /**
     * @param body - 入力データ
     * @param body.id - ユーザーID
     * @param body.password - パスワード
     * @param body.new_name - 新しい名前
     * @returns { status: number; result: { is_success: boolean; reason: string } } - 処理結果
     */
    const allowedParams = ["id", "password", "new_name"];
    const paramCheckResult = common.check_parameters(body, allowedParams);
    if (!paramCheckResult.result.is_success) {
        return paramCheckResult;
    }
    // バリデーション
    const validationResult = common.validation(body.id, body.password);
    if (!validationResult.result.is_success) {
        return validationResult;
    }
    // パスワードが正しいかどうかを確認
    const authResult = await common.authUser(body.id, body.password);
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
