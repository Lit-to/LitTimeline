import * as dbConnection from "../database/dbConnection.ts";
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

// function isValidUser(id: string, password: string): boolean {
//     // バリデーション
//     if (!isValidId(id)) {
//         return false;
//     }
//     if (!isValidPassword(password)) {
//         return false;
//     }
//     return true;
// }
async function isAlreadyExist(id: string): Promise<ResponseResult.ResponseResult> {
    // ユーザーが存在するかどうかを確認
    const idCount = await getIdCount.getIdCount(id);
    if (idCount.getIsSuccess()) {
        return ResponseResult.createSuccess();
    } else {
        return ResponseResult.createFailed(constants.INTERNAL_SERVER_ERROR, constants.SEARCH_ERROR_MESSAGE);
    }
}

async function register(req) {
    // ユーザー登録
    try {
        const hashedPassword = await encode(req.password);
        await query("INSERT INTO litter.users (user_id, name, password) VALUES (?, ?, ?)", [req.id, req.name, hashedPassword]);
        return gen_result_success();
    } catch (error) {
        return gen_result(false, config.INTERNAL_SERVER_ERROR, "データ挿入に失敗しました");
    }
}

async function remove(req) {
    // ユーザー削除
    try {
        await query("UPDATE litter.users SET is_deleted = true WHERE user_id = ?", [req.id]);
        return gen_result_success();
    } catch (error) {
        return gen_result(false, config.INTERNAL_SERVER_ERROR, "データ削除に失敗しました");
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

async function get_name_from_id(id) {
    try {
        const rows = await query("SELECT name FROM litter.users WHERE user_id = ? and is_deleted = false", [id]);
        if (rows.length == 1) {
            return rows[0].name;
        } else {
            return "";
        }
    } catch (error) {
        // エラー処理 失敗だが、空文字列とし名前が無かったものとして流す
        return "";
    }
}

async function init_session(req, user_id) {
    // セッションの初期化し、発行
    const user_name = await get_name_from_id(user_id);
    if (user_name == "") {
        return gen_result(false, config.NOT_FOUND, "ユーザーが存在しません");
    }
    const user_data = { id: user_id, name: user_name }; // ユーザの情報。返す内容が増えた場合はここを変更すればOK
    let is_successed = await set_session(req, user_data); // idと名前のデータをセッションに保存
    if (is_successed == false) {
        return gen_result(false, config.INTERNAL_SERVER_ERROR, "セッションの保存に失敗しました");
    }
    return gen_result_success();
}

export { check_parameters, isValidName, isValidPassword, isAlreadyExist, register, remove, get_name_from_id, encode, compare, init_session };
