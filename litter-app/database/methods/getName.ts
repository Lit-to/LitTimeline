import * as constants from "../../routes/constants.ts";
import * as db from "../dbConnection.ts";
import * as queries from "../queries.ts";
import * as QueryResult from "../types/QueryResult.ts";

async function getName(id: string): Promise<QueryResult.QueryResult<string>> {
    try {
        const rows = await db.query(queries.GET_NAME, [id]);
        if (rows.length != 1) {
            return new QueryResult.QueryResult(false, constants.MESSAGE_UNKNOWN_USER, constants.MESSAGE_UNKNOWN_USER);
        } else {
            return new QueryResult.QueryResult(true, rows[0].name, constants.EMPTY_STRING);
        }
    } catch (error) {
        return new QueryResult.QueryResult(false, constants.MESSAGE_SEARCH_ERROR, constants.MESSAGE_SEARCH_ERROR);
    }
}
export { getName };
