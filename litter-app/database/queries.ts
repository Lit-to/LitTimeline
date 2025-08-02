
/*クエリ集*/

/* パスワード取得 */
export const GET_PASSWORD = "SELECT password FROM litter.users WHERE user_id = ? and is_deleted = false";
export const UPDATE_PASSWORD = "UPDATE litter.users SET password = ? WHERE user_id = ?";
export const GET_ID = "SELECT id FROM litter.users WHERE user_id = ? and is_deleted = false";

