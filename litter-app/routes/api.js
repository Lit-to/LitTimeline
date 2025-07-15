// =================== インポート ==================
import { Router } from 'express';
const router = Router();

// import { HOST, PORT, CORSOPTION } from "./config.js";

// const router = express.Router();
import router_change_id from './api/change_id.js';
import router_change_name from './api/change_name.js';
import router_change_password from './api/change_password.js';
import router_is_correct from './api/is_correct.js';
import router_is_not_exist from './api/is_not_exist.js';
import router_register from './api/register.js';
import router_remove from './api/remove.js';
const router_login = require('./api/login.js');
const router_get_session_data = require('./api/get_session_data.js');
const router_logout = require('./api/logout.js');

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
/login: ログインを行うAPI
/get_session_data: セッションデータを取得するAPI
/logout: ログアウトし、セッションデータを破棄するAPI

// ================== 戻り値 ==================

{is_success: true, reason: [] ,data:{}}: 成功 ※dataはあれば
{is_success: false, reason: "理由"}: エラー・失敗時

*/

// ================== 関数 ==================

// ================== ルーティング ==================

router.use('/change_id', router_change_id);
router.use('/change_name', router_change_name);
router.use('/change_password', router_change_password);
router.use('/is_correct', router_is_correct);
router.use('/is_not_exist', router_is_not_exist);
router.use('/register', router_register);
router.use('/remove', router_remove);
router.use('/login', router_login);
router.use('/get_session_data', router_get_session_data);
router.use('/logout', router_logout);

export default router;
