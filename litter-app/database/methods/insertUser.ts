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
 * @param {string} name - ユーザー名
 * @param {string} newPassword - 新しいパスワード
 * @returns {Promise<QueryResult.QueryResult<boolean>>} - 処理結果
 */
async function insertUser(id: string,name:string,newPassword:string): Promise<QueryResult.QueryResult<boolean>> {
    try {
        const hashedPassword = await common.encode(newPassword);
        await db.query(queries.INSERT_USER, [id,hashedPassword,name]);
        return new QueryResult.QueryResult(true, true, constants.EMPTY_STRING);

    } catch (error) {
        return new QueryResult.QueryResult(false, false, constants.SEARCH_ERROR_MESSAGE);
    }
}
export { insertUser };
