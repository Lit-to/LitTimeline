# Eslintの導入

1.  これを実行
    ```bash
    npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier
    ```

2.  プロジェクトのルートに``eslintrc.json``を作成

    ```json
    {
        "extends": [
            "eslint:recommended",
            "plugin:prettier/recommended"
        ],
        "plugins": [
            "prettier"
        ],
        "rules": {
            "prettier/prettier": "error"
        }
    }
    ```

3.  プロジェクトのルートに``.prettierrc.json``

    ```json
    {
    "semi": true, //セミコロン自動
    "tabWidth": 4, //インデント4スペース強制
    "trailingComma": "none", //末尾カンマを自動削除
    "printWidth": 100 //横幅。100文字に広げた
    }
    ```

-   ざっくり概要
    -   prettierとEslintの同居環境を構築
    -   Eslintから見て、prettierに任せられる部分は対応任せるように

4.  **プロジェクトルートの**``./.vscode/settings.json``に以下の追記

    ```json
    {
    "prettier.requireConfig": false,
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[json]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
    }
    ```

-   ざっくり概要
    -   そのままデフォルトフォーマッタに指定してもビルトインのフォーマッタに吸われてしまうので、強制的に各言語のフォーマッタ設定を行う
    -   フォーマッタがただしくそのプロジェクトのconfigを参照するように、別々のフォルダで作る。
    -   プロジェクトごとに異なる設定をする可能性があるので、``litter-app``フォルダと``litter``フォルダで分ける。


