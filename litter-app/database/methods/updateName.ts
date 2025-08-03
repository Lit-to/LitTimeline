import * as common from "../../routes/common.ts";
import * as constants from "../../routes/constants.ts";
import * as db from "../dbConnection.ts";
import * as queries from "../queries.ts";
import * as QueryResult from "../types/QueryResult.ts";

async function updateName(id: string, newName: string): Promise<QueryResult.QueryResult<boolean>> {
    try {
        await db.query(queries.UPDATE_NAME, [newName, id]);
        return new QueryResult.QueryResult(true, true, constants.EMPTY_STRING);
    } catch (error) {
        return new QueryResult.QueryResult(false, false, constants.UPDATE_NAME_ERROR_MESSAGE);
    }
}
export { updateName };
