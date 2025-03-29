const express = require('express');
const app = express();
app.use(express.json()) // JSONリクエストを処理できるようにする

// ================== 簡単な説明 ==================
/*
それぞれのAPIに対してPOSTリクエストで送る。必要なパラメータは各APIの説明に記載。

/is_not_exist: ユーザーの存在を確認するAPI
/register: 新規ユーザー登録を行うAPI
/is_correct: パスワード認証を行うAPI
/change_password: ユーザーのパスワード変更を実行するAPI
/change_name: ユーザーの名前変更を行うAPI
/change_id: ユーザーIDの変更を実施するAPI
/remove: ユーザーを削除するAPI

// ================== 戻り値 ==================

{success: true, reason: [] }: 成功
{success: false, reason: "理由"}: エラー・失敗時

*/
// ================== 定数 ==================
const PORT = process.env.PORT || 3000;
const pool = require('./db.js');
const idValidPattern = /^[a-zA-Z0-9_]+$/;// ユーザーIDのバリデーション
const passValidPattern = /^[a-zA-Z0-9_]+$/;// パスワードのバリデーション


// ================== 関数 ==================

async function is_exist(value) {// ユーザーが存在するかどうかを確認
    let result = { result: { success: true, reason: [] }, status: 200 };
    try {
        const [rows] = await pool.query("SELECT id FROM litter.users WHERE user_id = ? and is_deleted = false", value); // `litter.users` テーブルのデータ取得
        if (rows.length > 0) {
            result.result.success = true;
        } else {
            result.result.success = false;
            result.result.reason.push("ユーザーが存在しません");
        }
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("ユーザーが存在しません");
        result.status = 500;

    }
    return result;
}

async function register(req) {// ユーザー登録
    result = { result: { success: true, reason: [] }, status: 200 };
    try {
        await pool.query("INSERT INTO litter.users (user_id, name, password) VALUES (?, ?, ?)", [req.id, req.name, req.password]); // `litter.users` テーブルにデータを挿入
        result.result.success = true;
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("データ挿入に失敗しました");
        result.status = 500;
    }
    return result;
}

async function is_correct(req) {// パスワードが正しいかどうかを確認
    result = { result: { success: true, reason: [] }, status: 200 };
    try {
        const [rows] = await pool.query("SELECT id FROM litter.users WHERE user_id = ? AND password = ?", [req.id, req.password]); // `litter.users` テーブルのデータ取得
        if (rows.length > 0) {
            result.result.success = true;
        } else {
            result.result.success = false;
            result.result.reason.push("パスワードが正しくありません");
            result.status = 400;
        }
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("パスワードが正しくありません");
        result.status = 400;
    }
    return result;
}

async function change_password(req) {// パスワード変更
    result = { result: { success: true, reason: [] }, status: 200 };
    try {
        await pool.query("UPDATE litter.users SET password = ? WHERE user_id = ?", [req.new_password, req.id]); // `litter.users` テーブルのデータ更新
        result.result.success = true;
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("データ更新に失敗しました");
        result.status = 500;
    }
    return result;
}

async function change_name(req) {// 名前変更
    result = { result: { success: true, reason: [] }, status: 200 };
    try {
        await pool.query("UPDATE litter.users SET name = ? WHERE user_id = ?", [req.new_name, req.id]); // `litter.users` テーブルのデータ更新
        result.result.success = true;
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("データ更新に失敗しました");
        result.status = 500;
    }
    return result;
}

async function change_id(req) {// id変更
    result = { result: { success: true, reason: [] }, status: 200 };
    try {
        await pool.query("UPDATE litter.users SET user_id = ? WHERE user_id = ?", [req.new_id, req.id]); // `litter.users` テーブルのデータ更新
        result.result.success = true
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("データ更新に失敗しました");
        result.status = 500;
    }
    return result;
}

async function remove(req) {// ユーザー削除
    result = { result: { success: true, reason: [] }, status: 200 };
    try {
        await pool.query("UPDATE litter.users SET is_deleted = true WHERE user_id = ?", [req.id]); // `litter.users` テーブルのデータ削除
        result.result.success = true;
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("データ削除に失敗しました");
        result.status = 500;
    }
    return result;
}

function check_parameters(param, allowedParams) {// パラメータのチェック
    result = { result: { success: true, reason: [] }, status: 200 };
    const receivedParams = Object.keys(param); // リクエストボディのパラメータを取得
    if (receivedParams.length !== allowedParams.length || receivedParams.some(param => !allowedParams.includes(param))) {
        result.result.success = false;
        result.result.reason.push("パラメータが不正です");
        result.status = 400;
    }
    return result;
}


function validation(value) {// バリデーション
    result = { result: { success: true, reason: [] }, status: 200 };
    // リクエストボディのパラメータ
    if (typeof (value.id) !== "string") {
        result.result.success = false;
        result.result.reason.push("ユーザーIDは文字列で入力してください");
        result.status = 400;
        return result;
    }
    if (typeof (value.password) !== "string") {
        result.result.success = false;
        result.result.reason.push("パスワードは文字列で入力してください");
        result.status = 400;
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

// ================== ルーティング ==================

app.post('/is_not_exist', async (req, res) => {
    /*
    idを受け取り、ユーザーが存在するかどうかを返す。
    入力:
    {
        id: 'ユーザーID'
    }
    */
    // パラメータのチェック
    const allowedParams = ['id']
    const paramCheckResult = check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // ユーザーが存在するかどうかを確認 
    // 本来ユーザが存在するか否かを返すべきだが、性質上｢いない｣場合に注目しているので逆転させている
    const result = await is_exist(req.body.id);
    result.result.success = !result.result.success;
    result.result.reason = ["ユーザーが既に存在します"];
    res.status(result.status).json(result.result);
    return;
}
)

app.post('/register', async (req, res) => {// ユーザー登録
    /*
    idとパスワードと名前を受け取り、ユーザーを登録する。
    既にユーザが存在している場合は失敗エラーを返す。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード',
        name: '名前'
    }*/
    // パラメータのチェック
    allowedParams = ['id', 'password', 'name']
    const paramCheckResult = check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const validationResult = validation(req.body);
    if (!validationResult.result.success) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // 既にいるかどうかのチェック
    const existResult = await is_exist(req.body.id);
    if (existResult.result.success) { // 既にいる場合
        res.status(400).json({ success: false, reason: ["ユーザーが既に存在します"] });
        return;
    }
    // ユーザー登録
    const result = await register(req.body);
    res.status(result.status).json(result.result);
    return;
});


app.post('/is_correct', async (req, res) => {
    /*
    idとパスワードを受け取り、パスワードが正しいかどうかを返す。
    パスワードはマスクし、認証を行う。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード'
    }
    */
    // パラメータのチェック
    allowedParams = ['id', 'password']
    const paramCheckResult = check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const result = await is_correct(req.body); // パスワードが正しいかどうかを確認
    res.status(result.status).json(result.result);
    return;
})


app.post('/change_password', async (req, res) => {
    /*
    idと新しいパスワードを受け取り、パスワードを変更する。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード',
        new_password: '新しいパスワード
    }    
    */
    // パラメータのチェック
    allowedParams = ['id', 'password', 'new_password']
    const paramCheckResult = check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const validationResult = validation(req.body);
    if (!validationResult.result.success) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // 認証
    const authResult = await is_correct(req.body); // パスワードが正しいかどうかを確認
    if (!authResult.result.success) {
        res.status(authResult.status).json(authResult.result);
        return;
    }
    // 新パスワードのバリデーション
    if (!passValidPattern.test(req.body.new_password)) {
        res.status(400).json({ success: false, reason: ["新しいパスワードが不正です"] });
        return;
    }
    // パスワード変更
    const result = await change_password(req.body);
    res.status(result.status).json(result.result);
    return;
})

app.post('/change_name', async (req, res) => {// 名前変更
    /*
    idと新しい名前を受け取り、名前を変更する。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード',
        new_name: '新しい名前
    }
    */
    // パラメータのチェック
    allowedParams = ['id', 'password', 'new_name']
    const paramCheckResult = check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const validationResult = validation(req.body);
    if (!validationResult.result.success) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // パスワードが正しいかどうかを確認
    const authResult = await is_correct(req.body); // パスワードが正しいかどうかを確認
    if (!authResult.result.success) {
        res.status(authResult.status).json(authResult.result);
        return;
    }
    // 名前変更
    const result = await change_name(req.body);
    res.status(result.status).json(result.result);
    return;
}
)

app.post('/change_id', async (req, res) => {// ユーザーID変更
    /*
    idと新しいユーザーIDを受け取り、ユーザーIDを変更する。
    
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード',
        new_id: '新しいユーザーID'
    }
    */
    // パラメータのチェック
    allowedParams = ['id', 'password', 'new_id']
    const paramCheckResult = check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const validationResult = validation(req.body);
    if (!(validationResult.result.success)) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // 認証
    const authResult = await is_correct(req.body); // パスワードが正しいかどうかを認証
    if (!authResult.result.success) {
        res.status(authResult.status).json(authResult.result);
        return;
    }
    // 既にいるかどうかのチェック
    const existResult = await is_exist(req.body.new_id);
    if (existResult.result.success) {
        res.status(400).json({ success: false, reason: "ユーザーが既に存在します" });
        return;
    }
    // 新idのバリデーション
    if (!idValidPattern.test(req.body.new_id)) {
        res.status(400).json({ success: false, reason: "新しいユーザーIDが不正です" });
        return;
    }
    // ユーザーID変更
    const result = await change_id(req.body); // ユーザーID変更
    res.status(result.status).json(result.result);
    return;
})

app.post('/remove', async (req, res) => {// ユーザー削除
    /*
    idとパスワードを受け取り、ユーザーを削除する。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード'
    }
    */
    // パラメータのチェック
    allowedParams = ['id', 'password']
    const paramCheckResult = check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const validationResult = validation(req.body);
    if (!(validationResult.result.success)) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // 認証
    const authResult = await is_correct(req.body); // パスワードが正しいかどうかを確認
    if (!authResult.result.success) {
        res.status(authResult.status).json(authResult.result);
        return;
    }
    // ユーザー削除
    const result = await remove(req.body);// ユーザー削除
    res.status(result.status).json(result.result);
    return;
})


    // ================== サーバー起動 ==================

    app.listen(PORT, () => { // サーバーを起動
        console.log(`Server is running on http://localhost:${PORT}`);
    });

module.exports = app;
