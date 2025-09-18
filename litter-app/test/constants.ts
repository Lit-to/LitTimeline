// test/constants.ts
const TEST_USER = {
    ID_PREFIX: "user_",
    NAME_PREFIX: "name_",
    PASSWORD: "foo",
    NEW_PASSWORD: "newfoo"
};


const API_PATHS = {
    REGISTER: "/register",
    LOGIN: "/login",
    CHANGE_PASSWORD: "/changePassword",
    CHANGE_NAME: "/changeName",
    CHANGE_ID: "/changeId",
    GET_USER_ID: "/getUserIdFromSession",
    GET_NAME: "/getName",
    REMOVE: "/remove"
};

const MESSAGES = {
    INVALID_PARAM: "不正なパラメータです",
    INVALID_USER_ID: "ユーザーIDが不正です",
    INVALID_USER_NAME: "ユーザー名が不正です",
    INVALID_PASSWORD: "パスワードが不正です",
    AUTH_FAILED: "認証に失敗しました",
    SUCCESS: "成功しました"
};

// 半角英数字+アンダーバー用の文字セット
const validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";

// 正常系: 半角英数字+アンダーバーのみ
function generateValidInput(length: number = 8): string {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += validChars.charAt(Math.floor(Math.random() * validChars.length));
    }
    return result;
}
function generateInvalidInput(): string {
    const invalidPools = [
        "", // 空文字
        "   ", // 空白
        "あいうえお", // 全角
        "!@#$%^&*", // 記号
        "user name", // スペース入り
        "abc-123" // 許可されてないハイフン
    ];

    // ランダムで既知のパターンを返す
    if (Math.random() < 0.5) {
        return invalidPools[Math.floor(Math.random() * invalidPools.length)];
    }

    // ランダムに異常文字を混ぜる
    const garbageChars = invalidPools.join("");
    let result = "";
    const len = Math.floor(Math.random() * 30) + 1;
    for (let i = 0; i < len; i++) {
        if (Math.random() < 0.7) {
            result += garbageChars.charAt(Math.floor(Math.random() * garbageChars.length));
        } else {
            result += validChars.charAt(Math.floor(Math.random() * validChars.length));
        }
    }
    return result;
}

export { TEST_USER, API_PATHS, MESSAGES, generateValidInput, generateInvalidInput };
