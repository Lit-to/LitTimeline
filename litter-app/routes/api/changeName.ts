import { Router } from "express";
const router = Router();
import * as common from "../common.ts";
import * as User from "../../types/User.ts";
import * as constants from "../constants.ts";

async function changeNameApi(user: User.User, password: string, newName: string) {
    // 名前変更
    // パラメータのチェック

    // バリデーション
    /**
     * 名前を変更する
     * @param {User} user - 変更したいユーザのオブジェクト
     * @param {string} password - ユーザのパスワード
     * @param {string} newName - 新しいユーザー名
     */
    // const validationResult = common.validation(body.id, body.password);
    // if (!validationResult.result.is_success) {
    // return validationResult;
    // }
    // 新名前のバリデーション
    if (!common.isValidName(newName)) {
        return common.genFailedResult(constants.BAD_REQUEST, constants.INVALID_NAME_MESSAGE);
    }
    // パスワードが正しいかどうかを確認
    const authResult = await user.certify(password);
    if (!authResult.getIsSuccess()) {
        return common.genFailedResult(authResult.getStatus(), authResult.getReason());
    }
    user.changeName(newName);
    if (!authResult.result.is_success) {
        return authResult;
    }
    // 名前変更
    return await common.change_name(body);
}

router.post("/", async (req, res) => {
    const allowedParams = ["id", "password", "newName"];
    const paramCheckResult = common.check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.is_success) {
        return res.status(paramCheckResult.status).json(paramCheckResult.result);
    }
    const user = User.User.createUser(req.body.id);
    const newName = req.body.newName;
    const password = req.body.password;
    const result = await changeNameApi(user, password, newName);
    res.status(result.status).json(result.result);
});

export { router };
