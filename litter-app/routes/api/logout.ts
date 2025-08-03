import * as express from "express";
import * as session from "../../types/SessionHandler.ts";
import * as sessionHandler from "../../types/SessionHandler.ts";
const router = express.Router();
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
    sessionHandler.SessionHandler.destroy(req.session);
    return paramCheckResult.formatResponse(res);
}

router.post("/", logoutHandler);

export { router };
