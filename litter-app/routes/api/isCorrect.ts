import * as express from "express";
const router = express.Router();
import * as constants from "../constants.ts";
import * as common from "../common.ts";
import * as User from "../../types/User.ts";
import * as ResponseResult from "../../types/ResponseResult.ts";

async function isAuthenticated(user: User.User, password: string): Promise<ResponseResult.ResponseResult> {
    return await user.certify(password);
}

router.post("/", async (req: express.Request, res: express.Response) => {
    /**
    idとパスワードを受け取り、パスワードが正しいかどうかを返す。
    @param req.body.id - ユーザーID
    @param req.body.password - パスワード
    @returns {Promise<ResponseResult.ResponseResult>} - 認証結果
    */
    // パラメータのチェック
    const allowedParams = [constants.API_PARAM_ID, constants.API_PARAM_PASSWORD];
    const paramCheckResult = common.checkParameters(req.body, allowedParams);
    if (!paramCheckResult.getIsSuccess()) {
        return paramCheckResult;
    }
    // 情報の洗い出し
    const user = User.User.createUser(req.body.id);
    const password = req.body.password;
    return await isAuthenticated(user, password);
});

export { router };
