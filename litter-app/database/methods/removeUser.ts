import * as common  from "../../routes/common";
import * as constants from "../../routes/constants";
import * as db from "../dbConnection";
import * as queries  from "../queries";
import * as QueryResult from "../types/QueryResult";

/**
 * DBにユーザー情報を新規挿入するメソッド
 *
 * @async
 * @param {string} id - ユーザーID
 * @returns {Promise<QueryResult.QueryResult<boolean>>} - 処理結果
 */
async function removeUser(id:string): Promise<QueryResult.QueryResult<boolean>> {
    // ユーザー削除
    try {
        await db.query(queries.REMOVE_USER, [id]);
        return new QueryResult.QueryResult(true, true, constants.EMPTY_STRING);
    } catch (error) {
        return new QueryResult.QueryResult(true, false, constants.UPDATE_ERROR_MESSAGE);
    }
}
export { removeUser };
