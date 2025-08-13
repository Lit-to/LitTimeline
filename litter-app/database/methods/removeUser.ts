import * as constants from "../../routes/constants.ts";
import * as db from "../dbConnection.ts";
import * as queries from "../queries.ts";
import * as QueryResult from "../types/QueryResult.ts";

/**
 * DBにユーザー情報を新規挿入するメソッド
 *
 * @async
 * @param {string} id - ユーザーID
 * @returns {Promise<QueryResult.QueryResult<boolean>>} - 処理結果
 */
async function removeUser(id: string): Promise<QueryResult.QueryResult<boolean>> {
    // ユーザー削除
    try {
        await db.query(queries.REMOVE_USER, [id]);
        return new QueryResult.QueryResult(true, true, constants.EMPTY_STRING);
    } catch (error) {
        return new QueryResult.QueryResult(true, false, constants.MESSAGE_UPDATE_ERROR);
    }
}
export { removeUser };
