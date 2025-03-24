const express = require('express');
const app = express();
app.use(express.json()) // JSONリクエストを処理できるようにする
const PORT = process.env.PORT || 3000;
const pool = require('./db.js');
const idValidPattern = /^[a-zA-Z0-9_]+$/;
const passValidPattern = /^[a-zA-Z0-9_]+$/;

app.get('/', (req, res) => { // rootテスト
    res.json({ message: 'Hello, World!\n' });
}
);


app.post('/validate_id', (req, res) => { //入力チェック ※現状パスワードとidは同じ条件でのバリデーション
    const input= req.body.value;
    if (typeof input !== 'string') {
        return res.status(400).json({ error: '入力は文字列でなければなりません' });
    }
    res.json({ result: idValidPattern.test(input)})
});

app.post('/validate_password', (req, res) => { //入力チェック ※現状パスワードとidは同じ条件でのバリデーション
    const input= req.body.value;
    if (typeof input !== 'string') {
        return res.status(400).json({ error: '入力は文字列でなければなりません' });
    }
    res.json({ result: passValidPattern.test(input)})
});

app.post('/is_exist', async (req, res) => {// ユーザーが存在するかどうかを確認
    try {
        const [rows] = await pool.query("SELECT id FROM users WHERE user_id = ? and is_deleted = false", [req.body.id]); // `users` テーブルのデータ取得
        res.json({ exist: rows.length > 0 }); // いなければ `rows.length` は 0 なので、その場合は `false` を返す
    } catch (error) {
        console.error(error + "\n");
        res.status(500).json({ error: 'データ取得に失敗しました' });
    }
});

app.post('/register', async (req, res) => {// ユーザー登録
    if (typeof req.body.id !== 'string' || typeof req.body.password !== 'string') {
        return res.status(400).json({ error: 'idとpasswordは文字列でなければなりません' });
    }
    if (!idValidPattern.test(req.body.id)) {
        return res.status(400).json({ error: 'idの形式が不正です' });
    }
    if (!passValidPattern.test(req.body.password)) {
        return res.status(400).json({ error: 'passwordの形式が不正です' });
    }
    if (req.body.id === undefined || req.body.name === undefined || req.body.password === undefined) {
        res.status(400).json({ error: 'リクエストが正しくありません\n' });
        return;
    }
    const allowedParams = ['id', 'name', 'password'];
    const receivedParams = Object.keys(req.body);
    if (receivedParams.length !== allowedParams.length || receivedParams.some(param => !allowedParams.includes(param))) {
        res.status(400).json({ error: '余分なパラメータが含まれています\n' });
        return;
    }
    try {
        await pool.query("INSERT INTO users (user_id, name, password) VALUES (?, ?, ?)", [req.body.id, req.body.name, req.body.password]); // `users` テーブルにデータを挿入
        res.json({ success: true });
    } catch (error) {
        console.error(error + "\n");
        res.status(500).json({ error: 'データ挿入に失敗しました\n' });
    }
});

app.post('/is_correct', async (req, res) => { // パスワードが正しいかどうかを確認
    try {
        const [rows] = await pool.query("SELECT id FROM users WHERE user_id = ? AND password = ?", [req.body.id, req.body.password]); // `users` テーブルのデータ取得
        res.json({ success: rows.length > 0 });
    } catch (error) {
        console.error(error + "\n");
        res.status(500).json({ error: 'データ取得に失敗しました\n' });
    }
});
//すぐに使うかはわからないが、一応作っておく
app.post("/change_password", async (req, res) => {// パスワード変更
    try {
        await pool.query("UPDATE users SET password = ? WHERE user_id = ?", [req.body.new_password, req.body.id]); // `users` テーブルのデータ更新
        res.json({ success: true });
    } catch (error) {
        console.error(error + "\n");
        res.status(500).json({ error: 'データ更新に失敗しました\n' });
    }
});

app.post("/change_name", async (req, res) => {// パスワード変更
    try {
        await pool.query("UPDATE users SET password = ? WHERE user_id = ?", [req.body.new_name, req.body.id]); // `users` テーブルのデータ更新
        res.json({ success: true });
    } catch (error) {
        console.error(error + "\n");
        res.status(500).json({ error: 'データ更新に失敗しました\n' });
    }
});
app.post("/change_id", async (req, res) => {// パスワード変更
    try {
        await pool.query("UPDATE users SET password = ? WHERE user_id = ?", [req.body.new_id, req.body.id]); // `users` テーブルのデータ更新
        res.json({ success: true });
    } catch (error) {
        console.error(error + "\n");
        res.status(500).json({ error: 'データ更新に失敗しました\n' });
    }
});

app.post("/delete", async (req, res) => {// ユーザー削除
    try {
        await pool.query("UPDATE users SET is_deleted = true FROM users WHERE user_id = ?", [req.body.id]); // `users` テーブルのデータ削除
        res.json({ success: true });
    } catch (error) {
        console.error(error + "\n");
        res.status(500).json({ error: 'データ削除に失敗しました\n' });
    }
});
app.listen(PORT, () => { // サーバーを起動
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
