import express from 'express';
import pool from './db.js';

const app = express();
const PORT = 3000;



app.get('/is_exist', async (req, res) => {// ユーザーが存在するかどうかを確認
    try {
        const [rows] = await pool.query("SELECT id FROM users WHERE user_id = ? and is_deleted = false", [req.query.id]); // `users` テーブルのデータ取得
        res.json({ exist: rows.length > 0 }); // いなければ `rows.length` は 0 なので、その場合は `false` を返す
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'データ取得に失敗しました' });
    }
});

app.get('/register', async (req, res) => {// ユーザー登録
    try {
        await pool.query("INSERT INTO users (user_id, password) VALUES (?, ?)", [req.query.id, req.query.password]); // `users` テーブルにデータを挿入
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'データ挿入に失敗しました' });
    }
});

app.get('/is_correct', async (req, res) => { // パスワードが正しいかどうかを確認
    try {
        const [rows] = await pool.query("SELECT id FROM users WHERE user_id = ? AND password = ?", [req.query.id, req.query.password]); // `users` テーブルのデータ取得
        res.json({ success: rows.length > 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'データ取得に失敗しました' });
    }
});


//すぐに使うかはわからないが、一応作っておく
app.get("/change_password", async (req, res) => {// パスワード変更
    try {
        await pool.query("UPDATE users SET password = ? WHERE user_id = ?", [req.query.new_password, req.query.id]); // `users` テーブルのデータ更新
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'データ更新に失敗しました' });
    }
});

app.get("/change_name", async (req, res) => {// パスワード変更
    try {
        await pool.query("UPDATE users SET password = ? WHERE user_id = ?", [req.query.new_name, req.query.id]); // `users` テーブルのデータ更新
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'データ更新に失敗しました' });
    }
});
app.get("/change_id", async (req, res) => {// パスワード変更
    try {
        await pool.query("UPDATE users SET password = ? WHERE user_id = ?", [req.query.new_id, req.query.id]); // `users` テーブルのデータ更新
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'データ更新に失敗しました' });
    }
});

app.get("/delete", async (req, res) => {// ユーザー削除
    try {
        await pool.query("UPDATE users SET is_deleted = true FROM users WHERE user_id = ?", [req.query.id]); // `users` テーブルのデータ削除
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'データ削除に失敗しました' });
    }
});

app.listen(PORT, () => { // サーバーを起動
    console.log(`Server is running on http://localhost:${PORT}`);
});
