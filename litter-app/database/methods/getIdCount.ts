import * as constants from "../../routes/constants";
import * as db from "../dbConnection";
import * as queries  from "../queries";
import * as QueryResult from "../types/QueryResult";

async function getIdCount(id: string): Promise<QueryResult.QueryResult<number>> {
    try {
        const rows = await db.query(queries.GET_ID, [id]);
        return new QueryResult.QueryResult(true, rows.length, constants.EMPTY_STRING);
    } catch (error) {
        return new QueryResult.QueryResult(false, constants.SQL_FAILED_CODE, constants.SEARCH_ERROR_MESSAGE);
    }
}
export { getIdCount };
