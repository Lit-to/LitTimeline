import * as constants from "../../routes/constants.ts";
import * as db from "../dbConnection.ts";
import * as queries from "../queries.ts";
import * as QueryResult from "../types/QueryResult.ts";
type RowDataPacket = import("mysql2").RowDataPacket;

async function getTimeline(userId: string, lastPostId: number, count: number): Promise<QueryResult.QueryResult<RowDataPacket[]>> {
    try {
        const rows = await db.query(queries.GET_TIMELINE, [Number(lastPostId), Number(count)]);
        return new QueryResult.QueryResult(true, rows, constants.EMPTY_STRING);
    } catch (error) {
        return new QueryResult.QueryResult(false, [], constants.MESSAGE_SEARCH_ERROR);
    }
}
export { getTimeline };
