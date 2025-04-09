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

function gen_result(result, status, message = "") {
    /*
    リザルトコードを生成する関数
    resultに成功か失敗かをTFで指定
    statusにステータスコードを指定、ただしresultがTrueの場合はSUCCESSで固定
    reasonに文字列として理由を指定(空欄の場合は空文字列)
    */
    if (result) {
        status = SUCCESS;
    }
    let res = {
        status: status,
        result: {
            is_success: result,
            reason: message
        },
        data: {}
    }

    return res
}
function check_parameters(param, allowedParams) {// パラメータのチェック
    const receivedParams = Object.keys(param); // リクエストボディのパラメータを取得
    if (receivedParams.length !== allowedParams.length || receivedParams.some(param => !allowedParams.includes(param))) {
        return gen_result(false, BAD_REQUEST, "パラメータが不正です");
    }
    else {
        return gen_result(true, SUCCESS);
    }
}


function validation(value) {// バリデーション
    // リクエストボディのパラメータ
    if (typeof (value.id) !== "string") {
        return gen_result(false, BAD_REQUEST, "ユーザーIDは文字列で入力してください");
    }
    if (value.password !== undefined || typeof (value.password) !== "string") {
        return gen_result(false, BAD_REQUEST, "パスワードは文字列で入力してください");
    }
    // バリデーション結果を格納するオブジェクト
    const idValidationResult = idValidPattern.test(value.id);
    const passValidationResult = passValidPattern.test(value.password);
    if (!idValidationResult) {
        return gen_result(false, BAD_REQUEST, "ユーザーIDが不正です");
    }
    if (!passValidationResult) {
        return gen_result(false, BAD_REQUEST, "パスワードが不正です");
    }
    return gen_result(true, SUCCESS);
}

async function change_id(req) {// id変更
    try {
        await pool.query("UPDATE litter.users SET user_id = ? WHERE user_id = ?", [req.new_id, req.id]);
        const result = gen_result(true, SUCCESS);
        return result
    } catch (error) {
        return gen_result(false, INTERNAL_SERVER_ERROR, "データ更新に失敗しました");
    }
}

async function change_name(req) {// 名前変更
    try {
        await pool.query("UPDATE litter.users SET name = ? WHERE user_id = ?", [req.new_name, req.id]);
        return gen_result(true, SUCCESS);
    } catch (error) {
        return gen_result(false, INTERNAL_SERVER_ERROR, "データ更新に失敗しました");
    }
}
async function change_password(req) {// パスワード変更
    hashedPassword = await encode(req.new_password);
    try {
        await pool.query("UPDATE litter.users SET password = ? WHERE user_id = ?", [hashedPassword, req.id]);
        return gen_result(true, SUCCESS);
    } catch (error) {
        return gen_result(false, INTERNAL_SERVER_ERROR, "データ更新に失敗しました");
    }
}
async function get_hashed_password(req) {
    try {
        const [rows] = await pool.query("SELECT password FROM litter.users WHERE user_id = ? and is_deleted = false", [req.id]);
        if (rows.length == 1) {
            let res = gen_result(true, SUCCESS);
            res.data.password = rows[0].password;
            return res;
        } else {
            let res = gen_result(false, BAD_REQUEST, "ユーザーが存在しません");
            return res;
        }
    } catch (error) {
        let res = gen_result(false, INTERNAL_SERVER_ERROR, "パスワード取得中にエラーが発生しました");
        return res;
    }
}

async function is_correct(req) {// パスワードが正しいかどうかを確認
    try {// ユーザーIDとパスワードが正しいレコードが存在するかをチェック
        const user_password = await get_hashed_password(req); //idからパスワードを取得
        if (!user_password.result.is_success) {
            return gen_result(false, BAD_REQUEST, "ユーザーが存在しません");
        }
        const compare_result = await compare(req.password, user_password.result.password);

        if (compare_result) {
            return gen_result(true, SUCCESS);

        } else {
            return gen_result(false, BAD_REQUEST, "パスワードが正しくありません");

        }
    } catch (error) {
        return gen_result(false, INTERNAL_SERVER_ERROR, "パスワード検証中にエラーが発生しました");
    }
}

async function is_exist(value) {// ユーザーが存在するかどうかを確認
    try {
        const [rows] = await pool.query("SELECT id FROM litter.users WHERE user_id = ? and is_deleted = false", value);
        if (rows.length > 0) {
            return gen_result(true, SUCCESS);
        } else {
            return gen_result(false, BAD_REQUEST, "ユーザーが既に存在しません");
        }
    } catch (error) {
        return gen_result(false, INTERNAL_SERVER_ERROR, "");

    }
}
async function register(req) {// ユーザー登録
    try {
        hashedPassword = await encode(req.password);
        await pool.query("INSERT INTO litter.users (user_id, name, password) VALUES (?, ?, ?)", [req.id, req.name, hashedPassword]);
        result = gen_result(true, SUCCESS);
        return result;
    } catch (error) {
        return gen_result(false, INTERNAL_SERVER_ERROR, "データ挿入に失敗しました");
    }
}

async function remove(req) {// ユーザー削除
    try {
        await pool.query("UPDATE litter.users SET is_deleted = true WHERE user_id = ?", [req.id]);
        result = gen_result(true, SUCCESS);
        return result;
    } catch (error) {
        return gen_result(false, INTERNAL_SERVER_ERROR, "データ削除に失敗しました");
    }
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

