const express = require('express');
const app = express();
app.use(express.json()) // JSONリクエストを処理できるようにする

// ================== 簡単な説明 ==================
/*
/is_exist: ユーザーの存在を確認するAPI
/register: 新規ユーザー登録を行うAPI
/is_correct: パスワード認証を行うAPI
/change_password: ユーザーのパスワード変更を実行するAPI
/change_name: ユーザーの名前変更を行うAPI
/change_id: ユーザーIDの変更を実施するAPI
/remove: ユーザーを削除するAPI
*/
// ================== 定数 ==================
const PORT = process.env.PORT || 3000;
const pool = require('./db.js');
const idValidPattern = /^[a-zA-Z0-9_]+$/;// ユーザーIDのバリデーション
const passValidPattern = /^[a-zA-Z0-9_]+$/;// パスワードのバリデーション


// ================== 関数 ==================

async function is_exist(value) {// ユーザーが存在するかどうかを確認
    result = { result: {}, status: 200 };
    try {
        const [rows] = await pool.query("SELECT id FROM litter.users WHERE user_id = ? and is_deleted = false",value); // `litter.users` テーブルのデータ取得
        result = { result: { exist: rows.length > 0 }, status: 200 }; // いなければ `rows.length` は 0 なので、その場合は `false` を返す
    } catch (error) {
        console.error(error + "");
        result = { result: { error: 'データ取得に失敗しました' }, status: 500 };
    }
    return result;
}

async function register(req) {// ユーザー登録
    res = { result: {}, status: 200 };
    try {
        await pool.query("INSERT INTO litter.users (user_id, name, password) VALUES (?, ?, ?)", [req.id, req.name, req.password]); // `litter.users` テーブルにデータを挿入
        res = { result: { success: true }, status: 200 };
    } catch (error) {
        console.error(error + "");
        res = { result: { error: 'データ挿入に失敗しました' }, status: 500 };
    }
    return result;
}

async function is_correct(req) {// パスワードが正しいかどうかを確認
    res = { result: {}, status: 200 };
    try {
        const [rows] = await pool.query("SELECT id FROM litter.users WHERE user_id = ? AND password = ?", [req.id, req.password]); // `litter.users` テーブルのデータ取得
        res = { result: { success: rows.length > 0 }, status: 200 };
    } catch (error) {
        console.error(error + "");
        res = { result: { error: 'データ取得に失敗しました' }, status: 500 };
    }
    return result;
}

async function change_password(req) {// パスワード変更
    res = { result: {}, status: 200 };
    try {
        await pool.query("UPDATE litter.users SET password = ? WHERE user_id = ?", [req.new_password, req.id]); // `litter.users` テーブルのデータ更新
        res = { result: { success: true }, status: 200 };
    } catch (error) {
        console.error(error + "");
        res = { result: { error: 'データ更新に失敗しました' }, status: 500 };
    }
    return result;
}

async function change_name(req) {// 名前変更
    res = { result: {}, status: 200 };
    try {
        await pool.query("UPDATE litter.users SET password = ? WHERE user_id = ?", [req.new_name, req.id]); // `litter.users` テーブルのデータ更新
        res = { result: { success: true }, status: 200 };
    } catch (error) {
        console.error(error + "");
        res = { result: { error: 'データ更新に失敗しました' }, status: 500 };
    }
    return result;
}

async function change_id(req) {// id変更
    res = { result: {}, status: 200 };
    try {
        await pool.query("UPDATE litter.users SET password = ? WHERE user_id = ?", [req.new_id, req.id]); // `litter.users` テーブルのデータ更新
        res = { result: { success: true }, status: 200 };
    } catch (error) {
        console.error(error + "");
        res = { result: { error: 'データ更新に失敗しました' }, status: 500 };
    }
    return result;
}

async function remove(req) {// ユーザー削除
    res = { result: {}, status: 200 };
    try {
        await pool.query("UPDATE litter.users SET is_deleted = true FROM litter.users WHERE user_id = ?", [req.id]); // `litter.users` テーブルのデータ削除
        res = { result: { success: true }, status: 200 };
    } catch (error) {
        console.error(error + "");
        res = { result: { error: 'データ削除に失敗しました' }, status: 500 };
    }
    return result;
}

function check_parameters(param, allowedParams) {// パラメータのチェック
    const receivedParams = Object.keys(value); // リクエストボディのパラメータを取得
    if (receivedParams.length !== allowedParams.length || receivedParams.some(param => !allowedParams.includes(param))) {
        return { result: { error: 'パラメータが不正です' }, status: 400 };
    }
    return { result: {}, status: 200 };
}

function pass_validation(value) {// パスワードのバリデーション
    if (!passValidPattern.test(value.body.password)) {
        return { result: false };
    }
    return { result: true };
}

function id_validation(value) {// idのバリデーション
    if (!idValidPattern.test(value.body.id)) {
        return { result: false };
    }
    return { result: true };
}

function validation(value,allowedParams) {// バリデーション
    // リクエストボディのパラメータ
    if (value.id !== String) {
        return { result: { error: 'idは文字列で入力してください' }, status: 400 };
    }
    if (value.password !== String) {
        return { result: { error: 'パスワードは文字列で入力してください' }, status: 400 };
    }

    // バリデーション結果を格納するオブジェクト
    result = { result: {}, status: 200 };

    const idValidation = id_validation(value.id); // ユーザーIDのバリデーション
    result.result.id = idValidation.result;

    const passValidation = pass_validation(value.id); // パスワードのバリデーション
    result.result.pass = passValidation.result;

    return result;
}

// ================== ルーティング ==================

app.post('/is_exist', async (req, res) => {
    /*
    idを受け取り、ユーザーが存在するかどうかを返す。
    入力:
    {
        id: 'ユーザーID'
    }
    結果:
    {
        exist: true
    }
    または
    {
        exist: false
    }
    */
    // パラメータのチェック
    allowedParams=['id']
    const paramCheckResult = check_parameters(req.body,allowedParams);
    if (paramCheckResult.status !== 200) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // ユーザーが存在するかどうかを確認
    const result = await is_exist(req.body.id);
    res.status(result.status).json(result.result);
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
    }
    
    結果:
    {
        success: true
    }
    または
    {
        error: 'エラーメッセージ'
    }
    */
    // パラメータのチェック
    allowedParams=['id','password','name']
    const paramCheckResult = check_parameters(req.body,allowedParams);
    if (paramCheckResult.status !== 200) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const validationResult = validation(req.body); // バリデーション
    if (validationResult.status !== 200) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // 既にいるかどうかのチェック
    const existResult = await is_exist(req.body.id);
    if (existResult.result.exist) {
        res.status(400).json({ error: 'ユーザーは既に存在しています' });
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
    結果:
    {
        success: true
    }
    または
    {
        success: false
    }
    または
    {
        error: 'エラーメッセージ'
    }
    で返す。
    */
    // パラメータのチェック
    allowedParams=['id','password']
    const paramCheckResult = check_parameters(req.body,allowedParams);
    if (paramCheckResult.status !== 200) {
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
    結果:
    {
        success: true
    }
    または
    {
        error: 'エラーメッセージ'
    }
    とする。    
    */
    // パラメータのチェック
    allowedParams=['id','password','new_password']
    const paramCheckResult = check_parameters(req.body,allowedParams);
    if (paramCheckResult.status !== 200) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const validationResult = validation(req.body); // バリデーション
    if (validationResult.status !== 200) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // 認証
    const authResult = await is_correct(req.body); // パスワードが正しいかどうかを確認
    if (!authResult.result.success) {
        res.status(400).json({ error: '認証に失敗しました' });
        return;
    }
    // バリデーション
    const newPassValidation = pass_validation({ body: { password: req.body.new_password } }); // 新しいパスワードのバリデーション
    if (!newPassValidation.result) {
        res.status(400).json({ error: '新しいパスワードが不正です' });
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
    結果:
    {
        success: true
    }
    または
    {
        error: 'エラーメッセージ'
    }
    */
    // パラメータのチェック
    allowedParams=['id','password','new_name']
    const paramCheckResult = check_parameters(req.body,allowedParams);
    if (paramCheckResult.status !== 200) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const validationResult = validation(req.body);
    if (validationResult.status !== 200) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // パスワードが正しいかどうかを確認
    const authResult = await is_correct(req.body); // パスワードが正しいかどうかを確認
    if (!authResult.result.success) {
        res.status(400).json({ error: '認証に失敗しました' });
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
    結果:
    {
        success: true
    }
    または
    {
        error: 'エラーメッセージ'
    }
    */
    // パラメータのチェック
    allowedParams=['id','password','new_id']
    const paramCheckResult = check_parameters(req.body,allowedParams);
    if (paramCheckResult.status !== 200) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const validationResult = validation(req.body); // バリデーション
    if (validationResult.status !== 200) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // 認証
    const authResult = await is_correct(req.body); // パスワードが正しいかどうかを認証
    if (!authResult.result.success) {
        res.status(400).json({ error: '認証に失敗しました' });
        return;
    }
    // 既にいるかどうかのチェック
    const existResult = await is_exist(req.body.new_id);
    if (existResult.result.exist) {
        res.status(400).json({ error: '新しいユーザーIDは既に存在しています' });
        return;
    }
    // バリデーション
    const newIdValidation = id_validation({ body: { id: req.body.new_id } }); // 新しいユーザーIDのバリデーション
    if (!newIdValidation.result) {
        res.status(400).json({ error: '新しいユーザーIDが不正です' });
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
    結果:
    {
        success: true
    }
        または
    {
        error: 'エラーメッセージ'
    }
    */
    // パラメータのチェック
    allowedParams=['id','password']
    const paramCheckResult = check_parameters(req.body,allowedParams);
    if (paramCheckResult.status !== 200) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const validationResult = validation(req.body); // バリデーション
    if (validationResult.status !== 200) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // 認証
    const authResult = await is_correct(req.body); // パスワードが正しいかどうかを確認
    if (!authResult.result.success) {
        res.status(400).json({ error: '認証に失敗しました' });
        return;
    }
    // ユーザー削除
    const result = await remove(req.body);// ユーザー削除
    res.status(result.status).json(result.result);
    return;
}) +


    // ================== サーバー起動 ==================

    app.listen(PORT, () => { // サーバーを起動
        console.log(`Server is running on http://localhost:${PORT}`);
    });

module.exports = app;
