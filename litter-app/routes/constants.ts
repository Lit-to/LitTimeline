/*ハードコーディング対策の定数*/

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
export const SUCCESS_MESSAGE = "成功しました";
export const INVALID_ID_MESSAGE = "ユーザーIDが不正です";
export const INVALID_NAME_MESSAGE = "ユーザー名が不正です";
export const INVALID_PASSWORD_MESSAGE = "パスワードが不正です";
export const INVALID_PARAMETERS = "不正なパラメータです";
export const INTERNAL_SERVER_ERROR_MESSAGE = "サーバーエラーが発生しました";
export const UNKNOWN_USER_MESSAGE = "ユーザーが存在しません";
export const SEARCH_ERROR_MESSAGE = "検索中にエラーが発生しました";
export const INSERT_ERROR_MESSAGE = "ユーザー登録中にエラーが発生しました";
export const UPDATE_ERROR_MESSAGE = "ユーザー情報更新中にエラーが発生しました";
export const UNAUTHORIZED_MESSAGE = "認証に失敗しました";
export const ALREADY_EXISTS_MESSAGE = "既に存在するユーザーIDです";

/* APIパラメータ */
export const API_PARAM_ID = "id";
export const API_PARAM_PASSWORD = "password";
export const API_PARAM_NAME = "name";
export const API_PARAM_NEW_NAME = "newName";
export const API_PARAM_NEW_ID = "newId";
export const API_PARAM_NEW_PASSWORD = "newPassword";


