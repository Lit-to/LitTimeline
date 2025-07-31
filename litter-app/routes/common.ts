import query from "./db.ts";
import { hash, compare as _compare } from "bcrypt"; // ハッシュ化で使う暗号化ライブラリ
import * as config from "./config.ts";

function gen_result_success() {
    /*
    成功リザルトコードを生成する関数
    */
    return gen_result(true, config.SUCCESS, "");
}

function gen_result(result: boolean, status: number, message: string) {
    /*
    リザルトコードを生成する関数
    resultに成功か失敗かをTFで指定
    statusにステータスコードを指定、ただしresultがTrueの場合はSUCCESSで固定
    reasonに文字列として理由を指定(空欄の場合は空文字列)
    */
    type Response<T = Record<string, any>> = {
        status: number;
        result: {
            is_success: boolean;
            reason: string;
        };
        data: T;
    };
    const res: Response = {
        status: status,
        result: {
            is_success: result,
            reason: message
        },
        data: {}
    };
    return res;
}
function check_parameters(param, allowedParams) {
    // パラメータのチェック
    const receivedParams = Object.keys(param); // リクエストボディのパラメータを取得
    if (receivedParams.length !== allowedParams.length || receivedParams.some((param) => !allowedParams.includes(param))) {
        return gen_result(false, config.BAD_REQUEST, "パラメータが不正です");
    } else {
        return gen_result_success();
    }
}

function isValidId(id: string): boolean {
    // IDのバリデーション/IDが正規表現に当てはまるかどうかをチェック
    return config.idValidPattern.test(id);
}

function isValidPassword(password: string): boolean {
    // パスワードのバリデーション/パスワードが正規表現に当てはまるかどうかをチェック
    return config.passValidPattern.test(password);
}

function isValidUser(id: string, password: string): boolean {
    // バリデーション
    if (!isValidId(id)) {
        return false;
    }
    if (!isValidPassword(password)) {
        return false;
    }
    return true;
}

async function change_id(req) {
    // id変更
    try {
        await query("UPDATE litter.users SET user_id = ? WHERE user_id = ?", [req.new_id, req.id]);
        return gen_result_success();
    } catch (error) {
        return gen_result(false, config.INTERNAL_SERVER_ERROR, "データ更新に失敗しました");
    }
}

async function change_name(req) {
    // 名前変更
    try {
        await query("UPDATE litter.users SET name = ? WHERE user_id = ?", [req.new_name, req.id]);
        return gen_result_success();
    } catch (error) {
        return gen_result(false, config.INTERNAL_SERVER_ERROR, "データ更新に失敗しました");
    }
}
async function change_password(req) {
    // パスワード変更
    const hashedPassword = await encode(req.new_password);
    try {
        await query("UPDATE litter.users SET password = ? WHERE user_id = ?", [hashedPassword, req.id]);
        return gen_result_success();
    } catch (error) {
        return gen_result(false, config.INTERNAL_SERVER_ERROR, "データ更新に失敗しました");
    }
}
async function get_hashed_password(req) {
    try {
        const rows = await query("SELECT password FROM litter.users WHERE user_id = ? and is_deleted = false", [req]);
        if (rows.length == 1) {
            let res = gen_result_success();
            res.data.password = rows[0].password;
            return res;
        } else {
            let res = gen_result(false, config.BAD_REQUEST, "ユーザーが存在しません");
            return res;
        }
    } catch (error) {
        let res = gen_result(false, config.INTERNAL_SERVER_ERROR, "パスワード取得中にエラーが発生しました");
        return res;
    }
}

async function authUser(id, password) {
    // パスワードが正しいかどうかを確認
    try {
        // ユーザーIDとパスワードが正しいレコードが存在するかをチェック
        const user_password = await get_hashed_password(id); //idからパスワードを取得
        if (!user_password.result.is_success) {
            return gen_result(false, config.BAD_REQUEST, "ユーザーが存在しません");
        }
        const compare_result = await compare(password, user_password.data.password);
        if (compare_result) {
            return gen_result_success();
        } else {
            return gen_result(false, config.BAD_REQUEST, "パスワードが正しくありません");
        }
    } catch (error) {
        return gen_result(false, config.INTERNAL_SERVER_ERROR, "パスワード検証中にエラーが発生しました");
    }
}

async function isAlreadyExist(id) {
    // ユーザーが存在するかどうかを確認
    try {
        const rows = await query("SELECT id FROM litter.users WHERE user_id = ? and is_deleted = false", [id]);
        if (rows.length > 0) {
            return gen_result_success();
        } else {
            return gen_result(false, config.BAD_REQUEST, "ユーザーが既に存在しません");
        }
    } catch (error) {
        return gen_result(false, config.INTERNAL_SERVER_ERROR, "");
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
async function compare(value, dbPassword) {
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
async function set_session(req, user) {
    req.session.user = {
        //セッションとして保存&返却するデータの内容
        id: req.body.id,
        name: user.name
    };
    return new Promise((resolve) => {
        req.session.save(
            //セッションを保存し、保存し終えてからレスポンスを返す
            (err) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }
        );
    });
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

export {
    gen_result,
    gen_result_success,
    check_parameters,
    isValidId,
    isValidPassword,
    change_id,
    change_name,
    change_password,
    authUser,
    isAlreadyExist,
    register,
    remove,
    get_name_from_id,
    get_hashed_password,
    encode,
    compare,
    set_session,
    init_session
};
