// =================== インポート ==================
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
const idValidPattern = /^[a-zA-Z0-9_]+$/;// ユーザーIDの入力条件(半角英数字とアンダーバーを1文字以上許容)
const passValidPattern = /^[a-zA-Z0-9_]+$/;// パスワードの入力条件(半角英数字とアンダーバーを1文字以上許容)

const INTERNAL_SERVER_ERROR = 500;
const BAD_REQUEST = 400;
const OK = 200;
const NOT_FOUND = 404;


// ================== 関数 ==================

// ================== ルーティング ==================



    // ================== サーバー起動 ==================

    app.listen(PORT, () => { // サーバーを起動
        console.log(`Server is running on http://localhost:${PORT}`);
    });

module.exports = app;
