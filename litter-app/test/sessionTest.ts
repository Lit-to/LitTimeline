import * as QueryResult from "../database/types/QueryResult";
import * as sessionManager from "../types/SessionManager";
import * as db from "../database/dbConnection";

describe("Session", () => {
    let s: sessionManager.SessionManager;
    let sessionID: string;
    let session: QueryResult.QueryResult<Map<string, string>>;
    let sessionData: Map<string, string>;
    beforeAll(async () => {
        s = await sessionManager.SessionManager.init("session_id", "sessions");
    });
    it("fetchColumns", async () => {
        const columns = await sessionManager.SessionManager.fetchColumns("sessions");
        expect(columns).toContain("session_id");
        expect(columns).toContain("user_id");
        expect(columns).toContain("is_logged_in");
        expect(columns).toContain("expire_at");
        expect(columns).toContain("created_at");
        expect(columns).toContain("updated_at");
    });
    it("createNewSession", async () => {
        sessionID = await s.createNewSession("Lit_to");
        expect(sessionID).toBeDefined();
        expect(sessionID.length).toBeGreaterThan(0);
    });
    it("getSessionFromId", async () => {
        session = await s.getSessionFromSessionId(sessionID);
        expect(session.getIsSuccess).toBe(true);
        expect(session.getResult.get("user_id")).toBe("Lit_to");
    });
    it("saveSession", async () => {
        sessionData = session.getResult;
        sessionData.set("is_logged_in", "1");
        await s.saveSession(sessionData);
        const updatedSession = await s.getSessionFromSessionId(sessionID);
        expect(updatedSession.getIsSuccess).toBe(true);
        expect(updatedSession.getResult.get("is_logged_in")).toBe(1);
    });
    afterAll(async () => {
        db.closePool();
    });
});
