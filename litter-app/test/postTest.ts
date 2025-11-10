import request from "supertest";
import { app, serverHook } from "../app.ts";
import * as constants from "./constants.ts";
import * as db from "../database/dbConnection";
import * as sessionManager from "../types/SessionManager";

// 共通変数
const userId = constants.TEST_USER.ID_PREFIX + constants.generateValidInput();
const password = constants.TEST_USER.PASSWORD;
const name = constants.TEST_USER.NAME_PREFIX + constants.generateValidInput();
const newPassword = constants.TEST_USER.NEW_PASSWORD;
const newName = constants.TEST_USER.NAME_PREFIX + constants.generateValidInput();
const newId = constants.TEST_USER.ID_PREFIX + constants.generateValidInput();
const wrongPassword = "aaaa";
let sessionId = "";

let postContent = [];
const monkeyTimes = 100;
const postCount = 20;
describe("ポスト系APIのテスト", () => {
    const agent = request.agent(app); //cookieを保持するエージェント
    let s: sessionManager.SessionManager;
    beforeAll(async () => {
        const res = await agent.post(constants.API_PATHS.REGISTER).send({ id: userId + "_sample", name: name, password: password });
        sessionId = res.headers["set-cookie"][0].split(";")[0].split("=")[1];
        for (let i = 0; i < postCount; ++i) {
            postContent.push({
                content: "これはテストポストです。" + constants.generateValidInput()
            });
        }
        await sessionManager.SessionManager.init("session_id", "sessions");
        s = sessionManager.SessionManager.getInstance();
    });
    let testCount = 0;
    it(`No.${++testCount}: ポストテスト`, async () => {
        for (let i = 0; i < postCount; ++i) {
            const res = await agent.post(constants.API_PATHS.POST).send(postContent[i]);
            expect(res.status).toBe(200);
            expect(res.body.result.isSuccess).toBe(true);
        }
    });

    it(`No.${++testCount}: ポスト取得テスト`, async () => {
        const res = await agent.post(constants.API_PATHS.GET_POSTS).send({ count: 20 });
        expect(res.status).toBe(200);
        expect(res.body.result.isSuccess).toBe(true);
        expect(res.body.result.data.length).toBe(postCount);
    });

    afterAll(async () => {
        await db.closePool();
        serverHook.close();
    });
});
