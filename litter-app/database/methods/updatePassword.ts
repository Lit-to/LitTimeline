import * as common from "../../routes/common.ts";
import * as constants from "../../routes/constants.ts";
import * as db from "../dbConnection.ts";
import * as queries from "../queries.ts";
import * as QueryResult from "../types/QueryResult.ts";

/**
 * idに紐づいたパスワードを変更する
 *
 * @async
 * @param {string} id - ユーザーID
 * @param {string} newPassword - 新しいパスワード
 * @returns {Promise<QueryResult.QueryResult<boolean>>} - クエリ結果オブジェクト
 */
async function updatePassword(id: string, newPassword: string): Promise<QueryResult.QueryResult<boolean>> {
    try {
        const hashedPassword = await common.encode(newPassword);
        await db.query(queries.UPDATE_PASSWORD, [hashedPassword, id]);
        return new QueryResult.QueryResult(true, true, constants.EMPTY_STRING);
    } catch (error) {
        return new QueryResult.QueryResult(false, false, constants.MESSAGE_SEARCH_ERROR);
    }
}
export { updatePassword };
