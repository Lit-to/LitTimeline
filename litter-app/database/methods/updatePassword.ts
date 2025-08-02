import * as common  from "../../routes/common";
import * as constants from "../../routes/constants";
import * as db from "../dbConnection";
import * as queries  from "../queries";
import * as QueryResult from "../types/QueryResult";

async function updatePassword(id: string, newPassword: string): Promise<QueryResult.QueryResult<boolean>> {
    try {
        const hashedPassword = await common.encode(newPassword);
        await db.query(queries.UPDATE_PASSWORD, [hashedPassword, id]);
        return new QueryResult.QueryResult(true, true, constants.EMPTY_STRING);

    } catch (error) {
        return new QueryResult.QueryResult(false, false, constants.SEARCH_ERROR_MESSAGE);
    }
}
export { updatePassword };
