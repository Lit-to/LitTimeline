import * as tsJest from "ts-jest";

const tsJestTransformCfg = tsJest.createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
    testEnvironment: "node",
    transform: {
        ...tsJestTransformCfg
    },
    testMatch: ["**/test/**/*.ts"]
};
