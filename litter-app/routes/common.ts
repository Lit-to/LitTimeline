import * as constants from "./constants.ts";
import { hash, compare as _compare } from "bcrypt"; // ハッシュ化で使う暗号化ライブラリ
import * as config from "./config.ts";
import * as ResponseResult from "../types/ResponseResult.ts";
import * as getIdCount from "../database/methods/getIdCount.ts";

function checkParameters(param: string[], allowedParams: string[]): ResponseResult.ResponseResult {
    // パラメータのチェック
    const receivedParams = Object.keys(param); // リクエストボディのパラメータを取得
    if (receivedParams.length !== allowedParams.length || receivedParams.some((param) => !allowedParams.includes(param))) {
        return ResponseResult.createFailed(constants.BAD_REQUEST, constants.INVALID_PARAMETERS);
    } else {
        return ResponseResult.createSuccess();
    }
}

async function isAlreadyExist(id: string): Promise<ResponseResult.ResponseResult> {
    // ユーザーが存在するかどうかを確認
    const idCount = await getIdCount.getIdCount(id);
    if (idCount.getResult == 0) {
        return ResponseResult.createSuccess();
    } else {
        return ResponseResult.createFailed(constants.INTERNAL_SERVER_ERROR, constants.SEARCH_ERROR_MESSAGE);
    }
}

async function encode(value) {
    const pepperedPassword = value + config.PEPPER;
    const hashedPassword = await hash(pepperedPassword, config.SALT_ROUNDS);
    return hashedPassword;
}
async function compare(value: string, dbPassword: string): Promise<boolean> {
    const pepperedPassword = value + config.PEPPER;
    const isMatch = await _compare(pepperedPassword, dbPassword);
    return isMatch;
}

export { checkParameters, isAlreadyExist, encode, compare };
