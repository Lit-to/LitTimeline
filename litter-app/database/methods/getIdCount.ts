import * as constants from "../../routes/constants.ts";
import * as db from "../dbConnection.ts";
import * as queries from "../queries.ts";
import * as QueryResult from "../types/QueryResult.ts";

async function getIdCount(id: string): Promise<QueryResult.QueryResult<number>> {
    try {
        const rows = await db.query(queries.GET_ID, [id]);
        return new QueryResult.QueryResult(true, rows.length, constants.EMPTY_STRING);
    } catch (error) {
        return new QueryResult.QueryResult(false, constants.SQL_FAILED_CODE, constants.MESSAGE_SEARCH_ERROR);
    }
}
export { getIdCount };
