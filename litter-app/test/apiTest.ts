import request from "supertest";
import { app, serverFook } from "../app.ts";
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
describe("ログイン系APIのテスト", () => {
    const agent = request.agent(app); //cookieを保持するエージェント
    beforeAll(async () => {
        const res = await agent.post(constants.API_PATHS.REGISTER).send({ id: userId + "_sample", name: name, password: password });
        sessionId = res.headers["set-cookie"][0].split(";")[0].split("=")[1];
    });
    let testCount = 0;
    // /register: 必須項目不足
    it(`No.${++testCount}: 登録:passwordがない`, async () => {
        const res = await request(app).post(constants.API_PATHS.REGISTER).send({ id: userId, name: newName });
        expect(res.status).toBe(400);
        expect(res.body.result.isSuccess).toBe(false);
        expect(res.body.result.reason).toBe(constants.MESSAGES.INVALID_PARAM);
    });

    it(`No.${++testCount}: 登録:nameがない`, async () => {
        const res = await request(app).post(constants.API_PATHS.REGISTER).send({ id: userId, password: password });
        expect(res.status).toBe(400);
        expect(res.body.result.isSuccess).toBe(false);
        expect(res.body.result.reason).toBe(constants.MESSAGES.INVALID_PARAM);
    });

    it(`No.${++testCount}: 登録:idがない`, async () => {
        const res = await request(app).post(constants.API_PATHS.REGISTER).send({ name: newName, password: password });
        expect(res.status).toBe(400);
        expect(res.body.result.isSuccess).toBe(false);
        expect(res.body.result.reason).toBe(constants.MESSAGES.INVALID_PARAM);
    });

    // /register: バリデーション失敗
    ++testCount;
    for (let i = 0; i < monkeyTimes; i++) {
        const invalidId = constants.generateInvalidInput();
        it(`No.${testCount}-${i} (input|${invalidId}): 登録:id非バリデーション`, async () => {
            const res = await request(app).post(constants.API_PATHS.REGISTER).send({ id: invalidId, name: newName, password: password });
            expect(res.status).toBe(400);
            expect(res.body.result.isSuccess).toBe(false);
            expect(res.body.result.reason).toBe(constants.MESSAGES.INVALID_USER_ID);
        });
    }

    // ++testCount; ※名前バリデーションは設けていないためスキップ
    // for (let i = 0; i < monkeyTimes; i++) {
    //     const invalidName = constants.generateInvalidInput();
    //     it(`No.${testCount}-${i} (input|${invalidName}): 登録:名前非バリデーション`, async () => {
    //         const res = await request(app).post(constants.API_PATHS.REGISTER).send({ id: userId, name: invalidName, password });
    //         expect(res.status).toBe(400);
    //         expect(res.body.result.isSuccess).toBe(false);
    //         expect(res.body.result.reason).toBe(constants.MESSAGES.INVALID_USER_NAME);
    //     });
    // }

    ++testCount;
    for (let i = 0; i < monkeyTimes; i++) {
        const invalidPass = constants.generateInvalidInput();
        it(`No.${testCount}-${i} (input|${invalidPass}): 登録:パスワード非バリデーション`, async () => {
            const res = await request(app).post(constants.API_PATHS.REGISTER).send({ id: userId, name: newName, password: invalidPass });
            expect(res.status).toBe(400);
            expect(res.body.result.isSuccess).toBe(false);
            expect(res.body.result.reason).toBe(constants.MESSAGES.INVALID_PASSWORD);
        });
    }

    // /register: 成功
    it(`No.${++testCount}: 登録:成功パターン`, async () => {
        const res = await request(app).post(constants.API_PATHS.REGISTER).send({ id: userId, name, password: password });
        expect(res.status).toBe(200);
        expect(res.body.result.isSuccess).toBe(true);
    });

    // /login: 認証失敗
    it(`No.${++testCount}: ログイン:認証失敗(認証)`, async () => {
        const res = await request(app).post(constants.API_PATHS.LOGIN).send({ id: userId, password: wrongPassword });
        expect(res.status).toBe(401);
        expect(res.body.result.isSuccess).toBe(false);
        expect(res.body.result.reason).toBe(constants.MESSAGES.AUTH_FAILED);
    });

    // /login: 成功
    it(`No.${++testCount}: ログイン:認証成功`, async () => {
        const res = await request(app).post(constants.API_PATHS.LOGIN).send({ id: userId, password: password });
        const cookies = res.headers["set-cookie"][0].split(";")[0].split("=")[1];
        expect(cookies).toBeDefined();
        expect(res.status).toBe(200);
        expect(res.body.result.isSuccess).toBe(true);
    });
    // /changePassword
    it(`No.${++testCount}: パスワード変更:現在のパスワードが誤っている`, async () => {
        const res = await request(app)
            .post(constants.API_PATHS.CHANGE_PASSWORD)
            .send({ id: userId, password: wrongPassword, newPassword: newPassword });
        expect(res.status).toBe(401);
        expect(res.body.result.isSuccess).toBe(false);
        expect(res.body.result.reason).toBe(constants.MESSAGES.AUTH_FAILED);
    });

    it(`No.${++testCount}: パスワード変更:正常なパスワード変更`, async () => {
        const res = await request(app).post(constants.API_PATHS.CHANGE_PASSWORD).send({ id: userId, password: password, newPassword: newPassword });
        expect(res.status).toBe(200);
        expect(res.body.result.isSuccess).toBe(true);
    });

    // /changeName: 認証失敗
    it(`No.${++testCount}: 名前変更:ユーザー名変更(認証失敗)`, async () => {
        const res = await request(app).post(constants.API_PATHS.CHANGE_NAME).send({ id: userId, password: wrongPassword, newName: newName });
        expect(res.status).toBe(401);
        expect(res.body.result.isSuccess).toBe(false);
        expect(res.body.result.reason).toBe(constants.MESSAGES.AUTH_FAILED);
    });

    // /changeName: 成功
    it(`No.${++testCount}: 名前変更:ユーザー名変更(成功)`, async () => {
        const res = await request(app).post(constants.API_PATHS.CHANGE_NAME).send({ id: userId, password: newPassword, newName: newName });
        expect(res.status).toBe(200);
        expect(res.body.result.isSuccess).toBe(true);
    });

    // /getUserIdFromSession
    it(`No.${++testCount}: セッションからユーザーIDを取得`, async () => {
        const res = await agent.get(constants.API_PATHS.GET_USER_ID);
        expect(res.status).toBe(200);
        expect(res.body.result.isSuccess).toBe(true);
        expect(res.body.result.data.userId).toBe(userId + "_sample");
    });

    // /changeId: 成功
    it(`No.${++testCount}: ID変更(成功)`, async () => {
        const res = await request(app).post(constants.API_PATHS.CHANGE_ID).send({ id: userId, password: newPassword, newId: newId });
        expect(res.status).toBe(200);
        expect(res.body.result.isSuccess).toBe(true);
    });

    // /getName
    it(`No.${++testCount}: ユーザー名取得`, async () => {
        const res = await request(app).post(constants.API_PATHS.GET_NAME).send({ id: newId });
        expect(res.status).toBe(200);
        expect(res.body.result.isSuccess).toBe(true);
        expect(res.body.result.data.name).toBe(newName);
    });

    // /remove
    it(`No.${++testCount}: ユーザー削除`, async () => {
        const res = await request(app).post(constants.API_PATHS.REMOVE).send({ id: newId, password: newPassword });
        expect(res.status).toBe(200);
        expect(res.body.result.isSuccess).toBe(true);
    });

    afterAll(async () => {
        db.closePool();
        serverFook.close();
    });
});
