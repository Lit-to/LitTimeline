/*ハードコーディング対策の定数*/
export const IS_TEST_ENV = process.env.JEST_WORKER_ID !== undefined;

/* 空文字列 */
export const EMPTY_STRING = "";

/* HTTPステータスコード */
export const SUCCESS = 200;
export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const NOT_FOUND = 404;
export const INTERNAL_SERVER_ERROR = 500;

/* SQLエラーコード */
export const SQL_FAILED_CODE = -1;

/* エラーメッセージ */
export const MESSAGE_ID_INVALID = "ユーザーIDが不正です";
export const MESSAGE_NAME_INVALID = "ユーザー名が不正です";
export const MESSAGE_PASSWORD_INVALID = "パスワードが不正です";
export const MESSAGE_INVALID_PARAMETERS = "不正なパラメータです";
export const MESSAGE_INTERNAL_SERVER_ERROR = "サーバーエラーが発生しました";
export const MESSAGE_UNKNOWN_USER = "ユーザーが存在しません";
export const MESSAGE_SEARCH_ERROR = "検索中にエラーが発生しました";
export const MESSAGE_INSERT_ERROR = "ユーザー登録中にエラーが発生しました";
export const MESSAGE_UPDATE_ERROR = "ユーザー情報更新中にエラーが発生しました";
export const MESSAGE_UNAUTHORIZED = "認証に失敗しました";
export const MESSAGE_ALREADY_USED = "既に存在するユーザーIDです";
export const MESSAGE_UPDATE_NAME_ERROR = "ユーザー名の更新中にエラーが発生しました";
export const MESSAGE_UPDATE_ID_ERROR = "ユーザーIDの更新中にエラーが発生しました";
export const MESSAGE_INVALID_SESSION = "セッションが不正です";
export const MESSAGE_POSTS_INSERT_ERROR = "投稿の登録中にエラーが発生しました";

/* APIパラメータ */
export const PARAM_ID = "id";
export const PARAM_PASSWORD = "password";
export const PARAM_NAME = "name";
export const PARAM_NEW_NAME = "newName";
export const PARAM_NEW_ID = "newId";
export const PARAM_NEW_PASSWORD = "newPassword";

/* セッション関連 */
export const PARAM_SESSION_ID = "sessionId";
export const SESSION_USER_ID = "user_id";
export const IS_LOGGED_IN = "is_logged_in";
export const TRUE_STRING = "true";
export const COOKIE_SESSION_ID = "sessionId";
