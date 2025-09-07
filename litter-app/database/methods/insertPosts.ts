import * as constants from "../../routes/constants.ts";
import * as db from "../dbConnection.ts";
import * as queries from "../queries.ts";
import * as QueryResult from "../types/QueryResult.ts";

/**
 * DBに新規ポストを挿入するメソッド
 *
 * @async
 * @param {string} id - ユーザーID
 * @param {string} contents - 投稿内容
 * @returns {Promise<QueryResult.QueryResult<boolean>>} - 処理結果
 */
async function insertUser(id: string, contents: string): Promise<QueryResult.QueryResult<boolean>> {
    try {
        await db.query(queries.INSERT_POSTS_CONTENTS, [id, contents]);
        return new QueryResult.QueryResult(true, true, constants.EMPTY_STRING);
    } catch (error) {
        return new QueryResult.QueryResult(false, false, constants.MESSAGE_POSTS_INSERT_ERROR);
    }
}
export { insertUser };
