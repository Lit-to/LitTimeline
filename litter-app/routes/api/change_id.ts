import { Router } from "express";
import * as common from "../common.ts";
import * as config from "../config.ts";
import * as User from "../../types/User.ts";

const router = Router();

async function change_id_api(user: User.User, password: string, newId: string) {
    /**
     * idと新しいユーザーIDを受け取り、ユーザーIDを変更する。
     *
     * @param {LtlTypes.User} user - 変更したいユーザのオブジェクト
     * @param {string} newId - 新しいユーザーID
     *  - 処理結果
     */
    // パラメータのチェック
    // const allowedParams = ["id", "password", "new_id"];
    // const paramCheckResult = common.check_parameters(user, allowedParams);
    // if (!paramCheckResult.result.is_success) {
    // return paramCheckResult;
    // }
    // try {
    // const requestUser = new LtlTypes.User(user.getId, user.getPassword);
    // } catch (err) {
    // if (err instanceof LtlTypes.InvalidUserError) {
    // return common.gen_result(false, config.BAD_REQUEST, "ユーザーIDまたはパスワードが不正です");
    // }
    // throw err;
    // }
    // 既にいるかどうかのチェック
    const existResult = await common.isAlreadyExist(newId);
    if (existResult.result.is_success) {
        return existResult;
    }
    // 認証
    const authResult = await user.certify(password);
    if () {
        return authResult;
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
        req: { body: { new_id: string; id: string; password: string } },
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
