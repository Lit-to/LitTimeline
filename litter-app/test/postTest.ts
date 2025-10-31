import request from "supertest";
import { app, serverHook } from "../app.ts";
import * as constants from "./constants.ts";
import * as db from "../database/dbConnection";

// 共通変数
const userId = constants.TEST_USER.ID_PREFIX + constants.generateValidInput();
const password = constants.TEST_USER.PASSWORD;
const name = constants.TEST_USER.NAME_PREFIX + constants.generateValidInput();
const newPassword = constants.TEST_USER.NEW_PASSWORD;
const newName = constants.TEST_USER.NAME_PREFIX + constants.generateValidInput();
const newId = constants.TEST_USER.ID_PREFIX + constants.generateValidInput();
const wrongPassword = "aaaa";
let sessionId = "";

const monkeyTimes = 100;
describe("ポスト系APIのテスト", () => {
    const agent = request.agent(app); //cookieを保持するエージェント
    beforeAll(async () => {
        const res = await agent.post(constants.API_PATHS.REGISTER).send({ id: userId + "_sample", name: name, password: password });
        sessionId = res.headers["set-cookie"][0].split(";")[0].split("=")[1];
    });
    let testCount = 0;
    for (let i = 0; i < monkeyTimes; i++) {
        it(`No.${++testCount}: ポストテスト`, async () => {
            const res = await agent
                .post(constants.API_PATHS.POST)
                .send({ id: userId + "_sample", content: "これはテストポストです。" + constants.generateValidInput() });
            expect(res.status).toBe(200);
            expect(res.body.result.isSuccess).toBe(true);
        });
    }

    afterAll(async () => {
        await db.closePool();
        serverHook.close();
    });
});
