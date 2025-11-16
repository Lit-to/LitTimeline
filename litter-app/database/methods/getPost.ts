import * as constants from "../../routes/constants.ts";
import * as db from "../dbConnection.ts";
import * as queries from "../queries.ts";
import * as QueryResult from "../types/QueryResult.ts";
import * as Posts from "../../types/Posts.ts";
/**
 * 特定のidのポストを取得する
 *
 * @async
 * @param {number} id
 * @returns {Promise<QueryResult.QueryResult<Post>>}
 */
async function getPost(id: number): Promise<QueryResult.QueryResult<Posts.Posts>> {
    try {
        const rows = await db.query(queries.GET_POST, [id]);
        if (rows.length === 0) {
            return new QueryResult.QueryResult(false, Posts.Posts.initEmptyPost(), constants.MESSAGE_NO_DATA);
        }
        const post = new Posts.Posts(
            rows[0].id,
            rows[0].user_id,
            rows[0].favorites,
            rows[0].parent_post_id,
            rows[0].is_deleted,
            rows[0].is_hidden,
            rows[0].created_at,
            rows[0].updated_at
        );
        return new QueryResult.QueryResult(true, post, constants.EMPTY_STRING);
    } catch (error) {
        return new QueryResult.QueryResult(false, Posts.Posts.initEmptyPost(), constants.MESSAGE_SEARCH_ERROR);
    }
}
export { getPost };
