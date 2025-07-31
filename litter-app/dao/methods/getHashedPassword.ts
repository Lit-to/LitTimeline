import * as constants from "../../routes/constants";
import * as db from "../dbConnection";
import * as queries  from "../queries";
import * as QueryResult from "../types/QueryResult";

async function getHashedPassword(id: string): Promise<QueryResult.QueryResult<string>> {
    try {
        const rows = await db.query(queries.GET_HASHED_PASSWORD, [id]);
        if (rows.length != 1) {
            return new QueryResult.QueryResult(false, constants.UNKNOWN_USER_MESSAGE, constants.UNKNOWN_USER_MESSAGE);
        } else {
            return new QueryResult.QueryResult(true,rows[0].password,constants.EMPTY_STRING);
        }
    } catch (error) {
        return new QueryResult.QueryResult(false, constants.SEARCH_ERROR_MESSAGE, constants.SEARCH_ERROR_MESSAGE);
    }
}
export { getHashedPassword };
