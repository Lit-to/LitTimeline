import * as tsJest from "ts-jest";

const tsJestTransformCfg = tsJest.createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
    testEnvironment: "node",
    transform: {
        ...tsJestTransformCfg
    },
    reporters: [
        "default" // 標準レポーター
    ],
    testMatch: ["**/test/**/*.ts"],
    testPathIgnorePatterns: [
        "/test/constants.ts" // 定数列挙ファイル
    ]
};
