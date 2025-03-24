const express = require('express');
const app = express();
app.use(express.json()) // JSONリクエストを処理できるようにする
const PORT = process.env.PORT || 3000;
const pool = require('./db.js');
const idValidPattern = /^[a-zA-Z0-9_]+$/;// ユーザーIDのバリデーション
const passValidPattern = /^[a-zA-Z0-9_]+$/;// パスワードのバリデーション

// ================== 関数 ==================

async function is_exist(value) {// ユーザーが存在するかどうかを確認
    res = { result: {}, status: 200 };
    try {
        const [rows] = await pool.query("SELECT id FROM users WHERE user_id = ? and is_deleted = false", value); // `users` テーブルのデータ取得
        res = { result: { exist: rows.length > 0 }, status: 200 }; // いなければ `rows.length` は 0 なので、その場合は `false` を返す
    } catch (error) {
        console.error(error + "");
        res = { result: { error: 'データ取得に失敗しました' }, status: 500 };
    }
    return result;
}

function pass_validation(value) {// パスワードのバリデーション
    if (typeof value !== 'string') {
        return { result: { error: 'passwordは文字列でなければなりません' }, status: 400 };
    }
    if (!passValidPattern.test(value.body.password)) {
        return { result: { error: 'passwordの形式が不正です' }, status: 400 };
    }
    return { result: {}, status: 200 };
}

function id_validation(value) {// ユーザーIDのバリデーション
    if (typeof value !== 'string') {
        return { result: { error: 'idは文字列でなければなりません' }, status: 400 };
    }
    if (!idValidPattern.test(value)) {
        return { result: { error: 'idの形式が不正です' }, status: 400 };
    }
    return { result: {}, status: 200 };
}

async function register(req) {// ユーザー登録
    res = { result: {}, status: 200 };
    try {
        await pool.query("INSERT INTO users (user_id, name, password) VALUES (?, ?, ?)", [req.id, req.name, req.password]); // `users` テーブルにデータを挿入
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
        const [rows] = await pool.query("SELECT id FROM users WHERE user_id = ? AND password = ?", [req.id, req.password]); // `users` テーブルのデータ取得
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
        await pool.query("UPDATE users SET password = ? WHERE user_id = ?", [req.new_password, req.id]); // `users` テーブルのデータ更新
        res = { result: { success: true }, status: 200 };
    } catch (error) {
        console.error(error + "");
        res = { result: { error: 'データ更新に失敗しました' }, status: 500 };
    }
    return result;
}

async function change_name(req) {// パスワード変更
    res = { result: {}, status: 200 };
    try {
        await pool.query("UPDATE users SET password = ? WHERE user_id = ?", [req.new_name, req.id]); // `users` テーブルのデータ更新
        res = { result: { success: true }, status: 200 };
    } catch (error) {
        console.error(error + "");
        res = { result: { error: 'データ更新に失敗しました' }, status: 500 };
    }
    return result;
}

async function change_id(req) {// パスワード変更
    res = { result: {}, status: 200 };
    try {
        await pool.query("UPDATE users SET password = ? WHERE user_id = ?", [req.new_id, req.id]); // `users` テーブルのデータ更新
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
        await pool.query("UPDATE users SET is_deleted = true FROM users WHERE user_id = ?", [req.id]); // `users` テーブルのデータ削除
        res = { result: { success: true }, status: 200 };
    } catch (error) {
        console.error(error + "");
        res = { result: { error: 'データ削除に失敗しました' }, status: 500 };
    }
    return result;
}

// ================== ルーティング ==================

app.post('/is_exist', async (req, res) => {
    const result = await is_exist(req);
    res.status(result.status).json(result.result);
}
)// ユーザーが存在するかどうかを確認;

app.post('/register', async (req, res) => {// ユーザー登録
    /*
    idとパスワードと名前を受け取り、ユーザーを登録する。
    既にユーザが存在している場合は失敗エラーを返す。
    結果は
    {
        success: true
    }
    または
    {
        error: 'エラーメッセージ'
    }
    とする。
    */


    const receivedParams = Object.keys(req.body); // リクエストボディのパラメータを取得
    if (receivedParams.length !== allowedParams.length || receivedParams.some(param => !allowedParams.includes(param))) {
        res.status(400).json({ error: '余分なパラメータが含まれています' });
        return;
    }

    const idValidation = id_validation(req.body.id); // ユーザーIDのバリデーション
    if (idValidation.status !== 200) {
        res.status(idValidation.status).json(idValidation.result);
        return;
    }

    const passValidation = pass_validation(req.body.password); // パスワードのバリデーション
    if (passValidation.status !== 200) {
        res.status(passValidation.status).json(passValidation.result);
        return;
    }
    const allowedParams = ['id', 'name', 'password'];
    const result = await register(req.body);
    res.status(result.status).json(result.result);
    return;
});


app.post('/is_correct', async (req, res) => {
    /*
    idとパスワードを受け取り、パスワードが正しいかどうかを返す。
    パスワードはマスクし、認証を行う。
    結果は
    {
        success: true
    }
    または
    {
        success: false
    }
    で返す。
    */

    const receivedParams = Object.keys(req.body); // リクエストボディのパラメータを取得
    if (receivedParams.length !== allowedParams.length || receivedParams.some(param => !allowedParams.includes(param))) {
        res.status(400).json({ error: '余分なパラメータが含まれています' });
        return;
    }

    const idValidation = id_validation(req.body.id); // ユーザーIDのバリデーション
    if (idValidation.status !== 200) {
        res.status(idValidation.status).json(idValidation.result);
        return;
    }

    const passValidation = pass_validation(req.body.password); // パスワードのバリデーション
    if (passValidation.status !== 200) {
        res.status(passValidation.status).json(passValidation.result);
        return;
    }
    const allowedParams = ['id', 'password'];
    const result = await is_correct(req.body);
    res.status(result.status).json(result.result);
    return;
})


app.post('/change_password', async (req, res) => {
    /*
    idと新しいパスワードを受け取り、パスワードを変更する。
    結果は
    {
        success: true
    }
    または
    {
        error: 'エラーメッセージ'
    }
    とする。    
    */
    const receivedParams = Object.keys(req.body); // リクエストボディのパラメータを取得
    if (receivedParams.length !== allowedParams.length || receivedParams.some(param => !allowedParams.includes(param))) {
        res.status(400).json({ error: '余分なパラメータが含まれています' });
        return;
    }

    const idValidation = id_validation(req.body.id); // ユーザーIDのバリデーション
    if (idValidation.status !== 200) {
        res.status(idValidation.status).json(idValidation.result);
        return;
    }

    const passValidation = pass_validation(req.body.new_password); // パスワードのバリデーション
    if (passValidation.status !== 200) {
        res.status(passValidation.status).json(passValidation.result);
        return;
    }
    const allowedParams = ['id', 'new_password'];
    const result = await change_password(req.body);
    res.status(result.status).json(result.result);
    return;
})

app.post('/change_name', async (req, res) => {// 名前変更
    /*
    idと新しい名前を受け取り、名前を変更する。
    結果は
    {
        success: true
    }
    または
    {
        error: 'エラーメッセージ'
    }
    とする。
    */
    const receivedParams = Object.keys(req.body); // リクエストボディのパラメータを取得
    if (receivedParams.length !== allowedParams.length || receivedParams.some(param => !allowedParams.includes(param))) {
        res.status(400).json({ error: '余分なパラメータが含まれています' });
        return;
    }

    const idValidation = id_validation(req.body.id); // ユーザーIDのバリデーション
    if (idValidation.status !== 200) {
        res.status(idValidation.status).json(idValidation.result);
        return;
    }

    const passValidation = pass_validation(req.body.new_name); // パスワードのバリデーション
    if (passValidation.status !== 200) {
        res.status(passValidation.status).json(passValidation.result);
        return;
    }
    const allowedParams = ['id', 'new_name'];
    const result = await change_name(req.body);
    res.status(result.status).json(result.result);
    return;
}
)

app.post('/change_id', async (req, res) => {// ユーザーID変更
    /*
    idと新しいユーザーIDを受け取り、ユーザーIDを変更する。
    結果は
    {
        success: true
    }
    または
    {
        error: 'エラーメッセージ'
    }
    とする。
    */
    const receivedParams = Object.keys(req.body); // リクエストボディのパラメータを取得
    if (receivedParams.length !== allowedParams.length || receivedParams.some(param => !allowedParams.includes(param))) {
        res.status(400).json({ error: '余分なパラメータが含まれています' });
        return;
    }

    const idValidation = id_validation(req.body.id); // ユーザーIDのバリデーション
    if (idValidation.status !== 200) {
        res.status(idValidation.status).json(idValidation.result);
        return;
    }

    const passValidation = pass_validation(req.body.new_id); // パスワードのバリデーション
    if (passValidation.status !== 200) {
        res.status(passValidation.status).json(passValidation.result);
        return;
    }
    const allowedParams = ['id', 'new_id'];
    const result = await change_id(req.body);
    res.status(result.status).json(result.result);
    return;
})

app.post('/remove', async (req, res) => {// ユーザー削除
    /*
    idを受け取り、ユーザーを削除する。
    結果は
    {
        success: true
    }
        または
    {
        error: 'エラーメッセージ'
    }
    とする。
    */
    const receivedParams = Object.keys(req.body); // リクエストボディのパラメータを取得
    if (receivedParams.length !== allowedParams.length || receivedParams.some(param => !allowedParams.includes(param))) {
        res.status(400).json({ error: '余分なパラメータが含まれています' });
        return;
    }

    const idValidation = id_validation(req.body.id); // ユーザーIDのバリデーション
    if (idValidation.status !== 200) {
        res.status(idValidation.status).json(idValidation.result);
        return;
    }

    const allowedParams = ['id'];
    const result = await remove(req.body);
    res.status(result.status).json(result.result);
    return;
})


// ================== サーバー起動 ==================

app.listen(PORT, () => { // サーバーを起動
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
