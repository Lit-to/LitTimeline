
/*クエリ集*/

/* パスワード取得 */
export const GET_HASHED_PASSWORD = "SELECT password FROM litter.users WHERE user_id = ? and is_deleted = false";

