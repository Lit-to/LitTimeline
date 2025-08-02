// =================== インポート ==================
import * as express from "express";
const router = express.Router();

import * as change_id from "./api/changeId.ts";
import * as change_name from "./api/changeName.ts";
import * as change_password from "./api/changePassword.ts";
import * as is_correct from "./api/isCorrect.ts";
import * as register from "./api/register.ts";
import * as remove from "./api/remove.ts";
import * as login from "./api/login.ts";
import * as get_session_data from "./api/getSessionData.ts";
import * as logout from "./api/logout.ts";

// ================== 簡単な説明 ==================
/*
それぞれのAPIに対してPOSTリクエストで送る。必要なパラメータは各APIの説明に記載。

/register: 新規ユーザー登録を行うAPI
/isCorrect: パスワード認証を行うAPI
/changePassword: ユーザーのパスワード変更を実行するAPI
/changeName: ユーザーの名前変更を行うAPI
/changeId: ユーザーIDの変更を実施するAPI
/remove: ユーザーを削除するAPI
/login: ログインを行うAPI
/getSessionData: セッションデータを取得するAPI
/logout: ログアウトし、セッションデータを破棄するAPI

// ================== 戻り値 ==================
@returns {express.Router} - 各APIのルーティングを含むExpressのRouterオブジェクト

*/

// ================== 関数 ==================

// ================== ルーティング ==================

router.use("/change_id", change_id.router);
router.use("/change_name", change_name.router);
router.use("/change_password", change_password.router);
router.use("/is_correct", is_correct.router);
router.use("/register", register.router);
router.use("/remove", remove.router);
router.use("/login", login.router);
router.use("/get_session_data", get_session_data.router);
router.use("/logout", logout.router);

export { router };
