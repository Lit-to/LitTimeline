import { Router } from "express";
import * as common from "../common.ts";
import * as config from "../config.ts";

const router = Router();

async function change_id_api(body) {
    /**
     * idと新しいユーザーIDを受け取り、ユーザーIDを変更する。
     *
     * 入力:
     * {
     *  id: 'ユーザーID',
     *  password: 'パスワード',
     *  new_id: '新しいユーザーID'
     * }
     */
    // パラメータのチェック
    const allowedParams = ["id", "password", "new_id"];
    const paramCheckResult = common.check_parameters(body, allowedParams);
    if (!paramCheckResult.result.is_success) {
        return paramCheckResult;
    }
    // バリデーション
    const validationResult = common.validation(body);
    if (!validationResult.result.is_success) {
        return validationResult;
    }
    // 認証
    const authResult = await common.is_correct(body); // パスワードが正しいかどうかを認証
    if (!authResult.result.is_success) {
        return authResult;
    }
    // 既にいるかどうかのチェック
    const existResult = await common.is_exist(body.new_id);
    if (existResult.result.is_success) {
        return existResult;
    }
    // 新idのバリデーション
    const isVallid = config.idValidPattern.test(body.new_id);
    if (!isVallid) {
        return common.gen_result(false, config.BAD_REQUEST, "新しいユーザーIDが不正です");
    }
    // ユーザーID変更
    const result = await common.change_id(body); // ユーザーID変更
    return common.gen_result(true, config.SUCCESS, "");
}

router.post(
    "/",
    async (
        req: { body: { new_id: string } },
        res: {
            status: (arg0: number) => {
                (): any;
                new (): any;
                json: { (arg0: { is_success: boolean; reason: string }): void; new (): any };
            };
        }
    ) => {
        const result = await change_id_api(req.body);
        res.status(result.status).json(result.result);
    }
);

export { router };
