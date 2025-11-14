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

let postContent = [];
const monkeyTimes = 100;
const postCount = 20;
describe("ポスト系APIのテスト", () => {
    const agent = request.agent(app); //cookieを保持するエージェント
    beforeAll(async () => {
        const res = await agent.post(constants.API_PATHS.REGISTER).send({ id: userId + "_sample", name: name, password: password });
        sessionId = res.headers["set-cookie"][0].split(";")[0].split("=")[1];
        for (let i = 0; i < postCount; ++i) {
            postContent.push({
                content: "これはテストポストです。" + constants.generateValidInput()
            });
        }
    });
    let testCount = 0;
    it(`No.${++testCount}: ポストテスト`, async () => {
        for (let i = 0; i < postCount; ++i) {
            // タイムライン取得
            const resGet = await agent.post(constants.API_PATHS.GET_POSTS).send({ count: postCount });
            if (i == 0) {
                // 0件の場合のみ、失敗することを確認
                expect(resGet.status).toBe(500);
            } else {
                expect(resGet.body.result.isSuccess).toBe(true);
                expect(resGet.body.result.data.length).toBe(i);
                expect(resGet.status).toBe(200);
            }
            // ポスト作成
            const resPost = await agent.post(constants.API_PATHS.POST).send(postContent[i]);
            expect(resPost.status).toBe(200);
            expect(resPost.body.result.isSuccess).toBe(true);

            // DBの処理が終わるまで待機
            await constants.sleep(10);
        }
    });

    afterAll(async () => {
        await db.closePool();
        serverHook.close();
    });
});
