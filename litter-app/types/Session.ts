
/**
 * 
 * httpセッションを司るクラス
 * DBは既に作っている想定
 * 
 * @class Session
 * @typedef {Session}
 */
class Session {
    private queryEntryPoint: Function;
    private tableName: string;
    private columns = {
        session_id: "session_id",
        user_id: "user_id",
        expire_at: "expire_at"
    };
    public static QUERIES = {
        FIND_SESSION_ID: "SELECT FROM ? WHERE user_id = ? and expire_at > NOW()",
        CREATE_SESSION_ID: "INSERT INTO ? (?) VALUES (?)",
    };

    constructor(tableName:string,queryEntryPoint: Function) {
        this.queryEntryPoint = queryEntryPoint;
        this.tableName = tableName;
    }

    public get getTableName(): string {
        return this.tableName;
    }

    private async createSessionId(userId:string): Promise<string> {
        await this.queryEntryPoint(Session.QUERIES.CREATE_SESSION_ID, [Session.QUERIES.COLUMN_SESSION_ID, this.tableName, userId]);
        const result = await this.queryEntryPoint(Session.QUERIES.FIND_SESSION_ID, [Session.QUERIES.COLUMN_SESSION_ID, this.tableName, userId]);
        return result[0][userId];
    }

    public async findSessionId(userId:string): Promise<string> {
        const result = await this.queryEntryPoint(Session.QUERIES.FIND_SESSION_ID, [Session.QUERIES.COLUMN_SESSION_ID, this.tableName, userId]);
        if (result[0][userId] != ""){
            return result[0][userId];
        }
        else{
            return this.createSessionId(userId);
        }

    }

}


