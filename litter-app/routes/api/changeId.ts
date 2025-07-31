import { Router } from "express";
import * as common from "../common.ts";
import * as config from "../config.ts";
import * as User from "../../types/User.ts";
import * as constants from "../constants.ts";

const router = Router();

async function changeIdApi(user: User.User, password: string, newId: string) {
    /**
     * idと新しいユーザーIDを受け取り、ユーザーIDを変更する。
     *
     * @param {LtlTypes.User} user - 変更したいユーザのオブジェクト
     * @param {string} newId - 新しいユーザーID
     *  - 処理結果
     */
    // 既にいるかどうかのチェック
    const existResult = await common.isAlreadyExist(newId);
    if (existResult.result.is_success) {
        return existResult;
    }
    // 認証
    const authResult = await user.certify(password);
    if (!authResult.getIsSuccess()) {
        return common.genFailedResult(authResult.getStatus(), authResult.getReason());
    }
    // 新idのバリデーション
    const changeResult = user.changeId(newId);
    return common.genResult(changeResult.getIsSuccess(), changeResult.getStatus(), changeResult.getReason());
}

router.post(
    "/",
    async (
        req: { body: { newId: string; id: string; password: string } },
        res: {
            status: (arg0: number) => {
                (): any;
                new (): any;
                json: { (arg0: { is_success: boolean; reason: string }): void; new (): any };
            };
        }
    ) => {
        const user = User.User.createUser(req.body.id);
        const newId = req.body.newId;
        const password = req.body.password;
        const result = await changeIdApi(user, password, newId);
        res.status(result.status).json(result.result);
    }
);

export { router };
