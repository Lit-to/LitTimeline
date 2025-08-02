import * as express from "express";
const router = express.Router();
import * as config from "../config.ts";
import * as common from "../common.ts";
import * as constants from "../constants.ts";

async function logoutHandler(req: express.Request, res: express.Response): Promise<express.Response> {
    /*
    idとパスワードを受け取り、ログアウト処理を行う。
    具体的にはセッションを破棄する。

    */
    // パラメータのチェック
    const allowedParams = [constants.API_PARAM_ID, constants.API_PARAM_PASSWORD];
    const paramCheckResult = common.checkParameters(req.body, allowedParams);
    if (!paramCheckResult.getIsSuccess) {
        return paramCheckResult.formatResponse(res);
    }
    req.session.destroy();
    return paramCheckResult.formatResponse(res);
}

router.post("/", logoutHandler);

export { router };
