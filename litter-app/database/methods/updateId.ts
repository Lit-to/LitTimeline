import * as common from "../../routes/common.ts";
import * as constants from "../../routes/constants.ts";
import * as db from "../dbConnection.ts";
import * as queries from "../queries.ts";
import * as QueryResult from "../types/QueryResult.ts";

async function updateId(id: string, newId: string): Promise<QueryResult.QueryResult<boolean>> {
    try {
        await db.query(queries.UPDATE_ID, [newId, id]);
        return new QueryResult.QueryResult(true, true, constants.EMPTY_STRING);
    } catch (error) {
        return new QueryResult.QueryResult(false, false, constants.MESSAGE_UPDATE_ID_ERROR);
    }
}
export { updateId };
