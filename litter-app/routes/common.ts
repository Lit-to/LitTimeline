import * as constants from "./constants.ts";
import * as bcrypt from "bcrypt"; // ハッシュ化で使う暗号化ライブラリ
import * as config from "./config.ts";
import * as ResponseResult from "../types/ResponseResult.ts";
import * as getIdCount from "../database/methods/getIdCount.ts";

/**
 * パラメータのチェックを行う関数
 * @note - リクエストボディのパラメータと必要なパラメータのリストを比較し、一致しない場合はエラーレスポンスを返す。
 * @param {string[]} param - チェック対象のパラメータリスト
 * @param {string[]} allowedParams - 必要とするパラメータのリスト
 * @returns {ResponseResult.ResponseResult}  - パラメータチェックの結果
 */
function checkParameters(param: string[], allowedParams: string[]): ResponseResult.ResponseResult {
    // パラメータのチェック
    const receivedParams = Object.keys(param); // リクエストボディのパラメータを取得
    if (receivedParams.length !== allowedParams.length || receivedParams.some((param) => !allowedParams.includes(param))) {
        return ResponseResult.ResponseResult.createFailed(constants.BAD_REQUEST, constants.MESSAGE_INVALID_PARAMETERS);
    } else {
        return ResponseResult.ResponseResult.createSuccess();
    }
}

/**
 * IDが既に存在するかどうかを確認する関数
 * @note - ユーザーIDを受け取り、データベースにそのユーザーが存在するかどうかを確認する。
 * @async
 * @param {string} id - ユーザーID
 * @returns {Promise<ResponseResult.ResponseResult>} - ユーザー存在確認の結果
 */
async function isAlreadyUsed(id: string): Promise<ResponseResult.ResponseResult> {
    // ユーザーが存在するかどうかを確認
    const idCount = await getIdCount.getIdCount(id);
    if (idCount.getResult == 0) {
        return ResponseResult.ResponseResult.createSuccess();
    } else {
        return ResponseResult.ResponseResult.createFailed(constants.INTERNAL_SERVER_ERROR, constants.MESSAGE_SEARCH_ERROR);
    }
}

/**
 * 文字列を暗号化エンコードする関数
 * @note - パスワードをハッシュ化するために使用される。
 * @async
 * @param {string} value - エンコードする文字列
 * @returns {Promise<string>} - エンコードされた文字列
 */
async function encode(value: string): Promise<string> {
    const pepperedPassword = value + config.PEPPER;
    const hashedPassword = await bcrypt.hash(pepperedPassword, config.SALT_ROUNDS);
    return hashedPassword;
}

/**
 * ハッシュ化されたパスワードと入力されたパスワードを比較する関数
 * @note - ユーザーがログインする際に、入力されたパスワードが正しいかどうかを確認するために使用される。
 * @async
 * @param {string} value - 入力されたパスワード
 * @param {string} dbPassword - ハッシュ化されたパスワード
 * @returns {Promise<boolean>} - パスワードが一致するかどうか
 */
async function compare(value: string, dbPassword: string): Promise<boolean> {
    const pepperedPassword = value + config.PEPPER;
    const isMatch = await bcrypt.compare(pepperedPassword, dbPassword);
    return isMatch;
}

export { checkParameters, isAlreadyUsed, encode, compare };
