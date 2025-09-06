import * as constants from "../../routes/constants.ts";
import * as db from "../dbConnection.ts";
import * as queries from "../queries.ts";
import * as QueryResult from "../types/QueryResult.ts";

async function getPostContents(id: number,count:number): Promise<QueryResult.QueryResult<number>> {
    try {
        const rows = await db.query(queries.GET_POSTS_CONTENTS, [id,count]);
        return new QueryResult.QueryResult(true, rows.length, constants.EMPTY_STRING);
    } catch (error) {
        return new QueryResult.QueryResult(false, constants.SQL_FAILED_CODE, constants.MESSAGE_SEARCH_ERROR);
    }
}
export { getPostContents };
