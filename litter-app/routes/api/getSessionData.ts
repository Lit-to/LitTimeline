import * as express from "express";
const router = express.Router();
import * as ResponseResult from "../../types/ResponseResult.ts";
import { SessionHandler } from "../../types/SessionHandler.ts";
import * as constants from "../constants.ts";
function getUserIdFromSession(req: express.Request, res: express.Response): ResponseResult.ResponseResult {
    /**
     * セッションデータを返却するAPI
     * 入力: (なし)
     * セッションに保存されているユーザーデータを返す。ない場合は空文字列を返す。
     */
    const userId = SessionHandler.getUserId(req);
    if (userId == undefined) {
        SessionHandler.setUserId(res, constants.EMPTY_STRING);
    }
    return ResponseResult.createSuccess();
}

router.get("/", getUserIdFromSession);
export { router };
