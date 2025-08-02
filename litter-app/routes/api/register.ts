import express from "express";
const router = express.Router();
import * as common from "../common.ts";
import * as config from "../config.ts";
import * as constants from "../constants.ts";
import { User } from "../../types/User.ts";
import * as ResponseResult from "../../types/ResponseResult.ts";

async function register(id: string, password: string, name: string): Promise<ResponseResult.ResponseResult> {
    /*
    idとパスワードと名前を受け取り、ユーザーを登録する。
    既にユーザが存在している場合は失敗エラーを返す。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード',
        name: '名前'
    }
    */
    //ユーザオブジェクトを作成
    const user = User.createUser(id);
    if (!user.getIsValid) {
        return ResponseResult.createFailed(constants.BAD_REQUEST, constants.INVALID_ID_MESSAGE);
    }
    // 入力規則に合っているかチェック
    const registerResult = await user.register(name, password);
    // ユーザー登録
    return registerResult;
}

async function registerHandler(req: express.Request, res: express.Response) {
    /*
    idとパスワードと名前を受け取り、ユーザーを登録する。
    既にユーザが存在している場合は失敗エラーを返す。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード',
        name: '名前'
    }
    */
    // パラメータのチェック
    const allowedParams = [constants.API_PARAM_ID, constants.API_PARAM_PASSWORD, constants.API_PARAM_NAME];
    const paramCheckResult = common.checkParameters(req.body, allowedParams);
    if (!paramCheckResult.getIsSuccess) {
        return paramCheckResult.formatResponse(res);
    }
    const registerResult = await register(req.body.id, req.body.password, req.body.name);
    return registerResult.formatResponse(res);
}

router.post("/", registerHandler);

export { router };
