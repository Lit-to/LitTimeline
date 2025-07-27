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

router.post("/", async (req, res) => {
    /*
    リクエストのセッションを破棄する。
    */
    // セッション認証
    if (req.session.user == undefined) {
        const result = common.gen_result(false, config.UNAUTHORIZED, "セッションが存在しません");
        res.status(config.UNAUTHORIZED).json(result);
        return;
    } else {
        req.session.destroy((err: any) => destroySession(err, res));
        return;
    }
});

export { router };
