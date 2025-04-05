const pool = require("./db.js");
const bcrypt = require('bcrypt'); // ハッシュ化で使う暗号化ライブラリ
const {
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    SUCCESS,
    NOT_FOUND,
    SALT_ROUNDS,
    idValidPattern,
    passValidPattern,
    PEPPER
} = require("./config.js");

function check_parameters(param, allowedParams) {// パラメータのチェック
    let result = { result: { success: true, reason: [] }, status: SUCCESS };
    const receivedParams = Object.keys(param); // リクエストボディのパラメータを取得
    if (receivedParams.length !== allowedParams.length || receivedParams.some(param => !allowedParams.includes(param))) {
        result.result.success = false;
        result.result.reason.push("パラメータが不正です");
        result.status = BAD_REQUEST;
    }
    return result;
}


function validation(value) {// バリデーション
    let result = { result: { success: true, reason: [] }, status: SUCCESS };
    // リクエストボディのパラメータ
    if (typeof (value.id) !== "string") {
        result.result.success = false;
        result.result.reason.push("ユーザーIDは文字列で入力してください");
        result.status = BAD_REQUEST;
        return result;
    }
    if (typeof (value.password) !== "string") {
        result.result.success = false;
        result.result.reason.push("パスワードは文字列で入力してください");
        result.status = BAD_REQUEST;
        return result;
    }
    // バリデーション結果を格納するオブジェクト
    result.result.success = false;
    const idValidationResult = idValidPattern.test(value.id);
    const passValidationResult = passValidPattern.test(value.password);
    result.result.success = idValidationResult && passValidationResult;
    if (!idValidationResult) {
        result.result.reason.push("ユーザーIDが不正です");
    }
    if (!passValidationResult) {
        result.result.reason.push("パスワードが不正です");
    }
    return result;
}

async function change_id(req) {// id変更
    let result = { result: { success: true, reason: [] }, status: SUCCESS };
    try {
        await pool.query("UPDATE litter.users SET user_id = ? WHERE user_id = ?", [req.new_id, req.id]);
        result.result.success = true
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("データ更新に失敗しました");
        result.status = INTERNAL_SERVER_ERROR;
    }
    return result;
}

async function change_name(req) {// 名前変更
    let result = { result: { success: true, reason: [] }, status: SUCCESS };
    try {
        await pool.query("UPDATE litter.users SET name = ? WHERE user_id = ?", [req.new_name, req.id]);
        result.result.success = true;
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("データ更新に失敗しました");
        result.status = INTERNAL_SERVER_ERROR;
    }
    return result;
}
async function change_password(req) {// パスワード変更
    let result = { result: { success: true, reason: [] }, status: SUCCESS };
    hashedPassword = await encode(req.new_password);
    try {
        await pool.query("UPDATE litter.users SET password = ? WHERE user_id = ?", [hashedPassword, req.id]);
        result.result.success = true;
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("データ更新に失敗しました");
        result.status = INTERNAL_SERVER_ERROR;
    }
    return result;
}
async function get_hashed_password(req) {
    let result = { result: { success: true, reason: [] }, status: SUCCESS };
    try {
        const [rows] = await pool.query("SELECT password FROM litter.users WHERE user_id = ? and is_deleted = false", [req.id]);
        if (rows.length == 1) {
            result.result.success = true;
            result.result.password = rows[0].password;
        } else {
            result.result.success = false;
            result.result.reason.push("ユーザーが存在しません");
            result.status = BAD_REQUEST;
        }
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("サーバーエラー");
        result.status = INTERNAL_SERVER_ERROR;

    }
    return result;
}

async function is_correct(req) {// パスワードが正しいかどうかを確認
    let result = { result: { success: true, reason: [] }, status: SUCCESS };
    try {// ユーザーIDとパスワードが正しいレコードが存在するかをチェック
        const user_password = await get_hashed_password(req); //idからパスワードを取得
        if (!user_password.result.success) {
            result.result.success = false;
            result.result.reason.push("ユーザーが存在しません");
            result.status = BAD_REQUEST;
            return result;
        }
        const compare_result = await compare(req.password, user_password.result.password);

        if (compare_result) {
            result.result.success = true;
        } else {
            result.result.success = false;
            result.result.reason.push("パスワードが正しくありません");
            result.status = BAD_REQUEST;
        }
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("サーバーエラー");
        result.status = INTERNAL_SERVER_ERROR;
    }
    return result;
}

async function is_exist(value) {// ユーザーが存在するかどうかを確認
    let result = { result: { success: true, reason: [] }, status: SUCCESS };
    try {
        const [rows] = await pool.query("SELECT id FROM litter.users WHERE user_id = ? and is_deleted = false", value);
        if (rows.length > 0) {
            result.result.success = true;
        } else {
            result.result.success = false;
            result.result.reason.push("ユーザーが既に存在しません");
        }
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("サーバーエラー");
        result.status = INTERNAL_SERVER_ERROR;

    }
    return result;
}
async function register(req) {// ユーザー登録
    let result = { result: { success: true, reason: [] }, status: SUCCESS };
    try {
        hashedPassword = await encode(req.password);
        await pool.query("INSERT INTO litter.users (user_id, name, password) VALUES (?, ?, ?)", [req.id, req.name, hashedPassword]);
        result.result.success = true;
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("データ挿入に失敗しました");
        result.status = INTERNAL_SERVER_ERROR;
    }
    return result;
}
async function remove(req) {// ユーザー削除
    let result = { result: { success: true, reason: [] }, status: SUCCESS };
    try {
        await pool.query("UPDATE litter.users SET is_deleted = true WHERE user_id = ?", [req.id]);
        result.result.success = true;
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("データ削除に失敗しました");
        result.status = INTERNAL_SERVER_ERROR;
    }
    return result;
}

async function encode(value) {
    const pepperedPassword = value + PEPPER
    const hashedPassword = await bcrypt.hash(pepperedPassword, SALT_ROUNDS);
    return hashedPassword;
}
async function compare(value, dbPassword) {
    const pepperedPassword = value + PEPPER
    const isMatch = await bcrypt.compare(pepperedPassword, dbPassword);
    return isMatch;
}

module.exports = {
    check_parameters,
    validation,
    change_id,
    change_name,
    change_password,
    is_correct,
    is_exist,
    register,
    remove
};

