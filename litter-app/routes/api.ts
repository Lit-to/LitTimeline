// =================== インポート ==================
import * as express from "express";
const router = express.Router();

import * as changeId from "./api/changeId.ts";
import * as changeName from "./api/changeName.ts";
import * as changePassword from "./api/changePassword.ts";
import * as register from "./api/register.ts";
import * as remove from "./api/remove.ts";
import * as login from "./api/login.ts";
import * as getUserIdFromSession from "./api/getUserIdFromSession.ts";
import * as getName from "./api/getName.ts";
import * as logout from "./api/logout.ts";
import * as post from "./api/addPost.ts";
import * as getTimeline from "./api/getTimeline.ts";

// ================== 簡単な説明 ==================
/*
それぞれのAPIに対してPOSTリクエストで送る。必要なパラメータは各APIの説明に記載。

/register: 新規ユーザー登録を行うAPI
/changePassword: ユーザーのパスワード変更を実行するAPI
/changeName: ユーザーの名前変更を行うAPI
/changeId: ユーザーIDの変更を実施するAPI
/remove: ユーザーを削除するAPI
/login: ログインを行うAPI
/getUserIdFromSession: セッションデータを取得するAPI
/getName: ユーザー名を取得するAPI
/logout: ログアウトし、セッションデータを破棄するAPI
/Post: ポストを追加するAPI
/getPost: ポストを取得するAPI
/getTimeline: 時系列順にポストを取得するAPI


// ================== 戻り値 ==================
@returns {express.Router} - 各APIのルーティングを含むExpressのRouterオブジェクト

*/

// ================== 関数 ==================

// ================== ルーティング ==================

router.use("/changeId", changeId.router);
router.use("/changeName", changeName.router);
router.use("/changePassword", changePassword.router);
router.use("/register", register.router);
router.use("/remove", remove.router);
router.use("/login", login.router);
router.use("/getUserIdFromSession", getUserIdFromSession.router);
router.use("/getName", getName.router);
router.use("/logout", logout.router);
router.use("/post", post.router);
router.use("/getTimeline", getTimeline.router);

export { router };
