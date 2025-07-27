// eslint.config.js
import js from "@eslint/js";
import jsdocPlugin from "eslint-plugin-jsdoc";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
    js.configs.recommended,
    prettierConfig,
    {
        plugins: {
            jsdoc: jsdocPlugin,
            prettier: prettierPlugin
        },
        rules: {
            "prettier/prettier": "error",
            "jsdoc/require-jsdoc": [
                "error",
                {
                    require: {
                        FunctionDeclaration: true,
                        MethodDefinition: true,
                        ClassDeclaration: true,
                        ArrowFunctionExpression: false,
                        FunctionExpression: false
                    }
                }
            ],
            "jsdoc/require-param": "error",
            "jsdoc/require-returns": "error"
        }
    }
];
