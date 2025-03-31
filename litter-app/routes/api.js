// =================== インポート ==================
const express = require('express');
const app = express();
app.use(express.json()) // JSONリクエストを処理できるようにする

const {
    PORT
} = require("./config.js");


// const router = express.Router();
const router_change_id = require('./api/change_id.js');
const router_change_name = require('./api/change_name.js');
const router_change_password = require('./api/change_password.js');
const router_is_correct = require('./api/is_correct.js');
const router_is_exist = require('./api/is_exist.js');
const router_register = require('./api/register.js');
const router_remove = require('./api/remove.js');

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

// ================== 関数 ==================

// ================== ルーティング ==================

app.use('/change_id', router_change_id);
app.use('/change_name', router_change_name);
app.use('/change_password', router_change_password);
app.use('/is_correct', router_is_correct);
app.use('/is_not_exist', router_is_exist);
app.use('/register', router_register);
app.use('/remove', router_remove);

// ================== サーバー起動 ==================
app.listen(PORT, () => { // サーバーを起動
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
