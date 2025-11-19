import * as constants from "../../routes/constants.ts";
import * as db from "../dbConnection.ts";
import * as queries from "../queries.ts";
import * as QueryResult from "../types/QueryResult.ts";
type RowDataPacket = import("mysql2").RowDataPacket;

/**
 * タイムライン取得関数
 * 特定のユーザーのポストのうち、idがlastPostIdより大きいものをcount件取得する
 * @async
 * @param {string} userId
 * @param {number} lastPostId
 * @param {number} count
 * @returns {Promise<QueryResult.QueryResult<RowDataPacket[]>>}
 */
async function getTimeline(userId: string, lastPostId: number, count: number): Promise<QueryResult.QueryResult<RowDataPacket[]>> {
    try {
        let rows: RowDataPacket[];
        if (lastPostId === 0) {
            rows = await db.query(queries.GET_TIMELINE_FROM_MAX, [userId, Number(count)]);
        } else {
            rows = await db.query(queries.GET_TIMELINE_FROM_ID, [userId, Number(lastPostId), Number(count)]);
        }
        return new QueryResult.QueryResult(true, rows, constants.EMPTY_STRING);
    } catch (error) {
        return new QueryResult.QueryResult(false, [], constants.MESSAGE_SEARCH_ERROR);
    }
}
export { getTimeline };
