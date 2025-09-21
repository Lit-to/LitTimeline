import * as common from "../routes/common.ts";
import * as constants from "./constants.ts";
import * as db from "../database/dbConnection";
// 共通変数

const monkeyTimes = 100;
describe("DAO関数のテスト", () => {
    let testCount = 0;
    const validInput = constants.generateValidInput();
    
    it(`No.${++testCount}: クエリテスト-ユーザーカウント`, async () => {
        const result = await db.getIdCount.getIdCount(validInput);
        expect(result).toBeDefined();
        expect(result.getResult).toEqual(0);
    });
    it(`No.${++testCount}: クエリテスト-ユーザーカウント`, async () => {
        await db.query("INSERT INTO users(user_id, name, password) VALUES(?, ?, ?)", [validInput, "testName", "testPassword"]);
        const result = await db.getIdCount.getIdCount(validInput);
        expect(result).toBeDefined();
        expect(result.getResult).toEqual(1);
    });

    afterAll(async () => {
        db.closePool();
    });
});
