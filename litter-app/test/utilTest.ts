import * as common from "../routes/common.ts";
import * as constants from "./constants.ts";
import * as db from "../database/dbConnection";

// 共通変数

const monkeyTimes = 100;
describe("共通関数のテスト", () => {
    let testCount = 0;
    const userId = constants.TEST_USER.ID_PREFIX + constants.generateValidInput(); //場合によって被る可能性あるがそこまで高い確率ではないので許容
    const userName = constants.TEST_USER.NAME_PREFIX + constants.generateValidInput();
    const password = constants.TEST_USER.PASSWORD;

    it(`No.${++testCount}: パラメータチェック関数(失敗)`, async () => {
        const result = common.checkParameters(["id", "name"], ["id", "name", "password"]);
        expect(result).toBeDefined();
        expect(result.isSuccess).toEqual(false);
    });

    it(`No.${++testCount}: パラメータチェック関数(失敗)`, async () => {
        const result = common.checkParameters(["id", "name"], ["id"]);
        expect(result).toBeDefined();
        expect(result.isSuccess).toEqual(false);
    });

    it(`No.${++testCount}: パラメータチェック関数(成功)`, async () => {
        const result = common.checkParameters(["id", "name", "password"], ["id", "name", "password"]);
        expect(result).toBeDefined();
        expect(result.isSuccess).toEqual(true);
    });

    it(`No.${++testCount}: ID存在確認関数(いない)`, async () => {
        const result = await common.isNotAlreadyUsed(userId);
        expect(result).toBeDefined();
        expect(result.isSuccess).toEqual(true);
    });
    it(`No.${++testCount}: ID存在確認関数(いる)`, async () => {
        const userId = constants.TEST_USER.ID_PREFIX + constants.generateValidInput();
        await db.query("INSERT INTO users(user_id, name, password) VALUES(?, ?, ?)", [userId, userName, password]);
        const result = await common.isNotAlreadyUsed(userId);
        expect(result).toBeDefined();
        expect(result.isSuccess).toEqual(false);
    });

    afterAll(async () => {
        db.closePool();
    });
});
