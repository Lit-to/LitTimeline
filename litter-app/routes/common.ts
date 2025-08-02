import * as constants from "./constants.ts";
import { hash, compare as _compare } from "bcrypt"; // ハッシュ化で使う暗号化ライブラリ
import * as config from "./config.ts";
import * as ResponseResult from "../types/ResponseResult.ts";
import * as getIdCount from "../database/methods/getIdCount.ts";

function check_parameters(param: string[], allowedParams: string[]): ResponseResult.ResponseResult {
    // パラメータのチェック
    const receivedParams = Object.keys(param); // リクエストボディのパラメータを取得
    if (receivedParams.length !== allowedParams.length || receivedParams.some((param) => !allowedParams.includes(param))) {
        return ResponseResult.createFailed(constants.BAD_REQUEST, constants.INVALID_ID_MESSAGE);
    } else {
        return ResponseResult.createSuccess();
    }
}
function isValidName(id: string): boolean {
    // 名前のバリデーションに関しては、特に現時点で設定の予定はないため全通過。ただし、将来的に名前のバリデーションが必要になった場合はここを変更する
    return true;
}

function isValidPassword(password: string): boolean {
    // パスワードのバリデーション/パスワードが正規表現に当てはまるかどうかをチェック
    return config.passValidPattern.test(password);
}

async function isAlreadyExist(id: string): Promise<ResponseResult.ResponseResult> {
    // ユーザーが存在するかどうかを確認
    const idCount = await getIdCount.getIdCount(id);
    if (idCount.getIsSuccess()) {
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

export { check_parameters, isValidName, isValidPassword, isAlreadyExist, encode, compare };
