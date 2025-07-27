import { Router } from "express";
const router = Router();
import * as config from "../config.ts";

router.post("/", async (req, res) => {
    /*
    リクエストのセッションを破棄する。
    成功した場合はTrue、失敗した場合はFalseを返却する。
    */
    // セッション認証
    if (req.session.user == undefined) {
        res.status(config.UNAUTHORIZED).json({
            is_success: false,
            reason: ["セッションがありません"]
        });
        return;
    } else {
        req.session.destroy((err) => {
            if (err) {
                res.status(config.INTERNAL_SERVER_ERROR).json({
                    is_success: false,
                    reason: ["セッションの破棄に失敗しました"]
                });
                return;
            } else {
                res.status(config.SUCCESS).json({
                    is_success: true,
                    reason: [],
                    data: {}
                });
                return;
            }
        });
    }
    return;
});

export { router };
