// =================== インポート ==================
import { Router } from "express";
const router = Router();

// import { HOST, PORT, CORSOPTION } from "./config.ts";

// const router = express.Router();
import * as change_id from "./api/change_id.ts";
import * as change_name from "./api/change_name.ts";
import * as change_password from "./api/change_password.ts";
import * as is_correct from "./api/is_correct.ts";
import * as is_not_exist from "./api/is_not_exist.ts";
import * as register from "./api/register.ts";
import * as remove from "./api/remove.ts";
import * as login from "./api/login.ts";
import * as get_session_data from "./api/get_session_data.ts";
import * as logout from "./api/logout.ts";

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

router.use("/change_id", change_id.router);
router.use("/change_name", change_name.router);
router.use("/change_password", change_password.router);
router.use("/is_correct", is_correct.router);
router.use("/is_not_exist", is_not_exist.router);
router.use("/register", register.router);
router.use("/remove", remove.router);
router.use("/login", login.router);
router.use("/get_session_data", get_session_data.router);
router.use("/logout", logout.router);

export { router };
