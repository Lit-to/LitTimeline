import { Router } from "express";
const router = Router();
import * as config from "../config.ts";
import * as common from "../common.ts";

function destroySession(err: any, res: any) {
    if (err) {
        const result = common.gen_result(false, config.INTERNAL_SERVER_ERROR, "セッションの破棄中にエラーが発生しました");
        return res.status(result.status).json(result);
    } else {
        const result = common.gen_result(true, config.SUCCESS, "");
        return res.status(result.status).json(result);
    }
}

router.post("/", async (req: express.Request, res: express.Response) => {
    /*
    idとパスワードを受け取り、ログイン処理を行う。
    成功した場合はセッションidを返却し、失敗した場合はエラーメッセージを返却する。
    入力:
    {
        id: 'ユーザーID'
        password: 'パスワード'
    }
    */
    // パラメータのチェック
    const allowedParams = [constants.API_PARAM_ID, constants.API_PARAM_PASSWORD];
    const paramCheckResult = common.check_parameters(req.body, allowedParams);
    if (!paramCheckResult.getIsSuccess()) {
        return paramCheckResult;
    }

    const result = await login(req.body.id, req.body.password, res);
    return result.formatResponse(res);
});
