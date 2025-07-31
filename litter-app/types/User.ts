import * as common from "../routes/common";
import * as InvalidUserError from "./InvalidUserError";
import * as constants from "../routes/constants";
//staticにでvalidationやって、コンストラクタを呼ぶ時点ではvalidationが保証された状態にする
//成功or失敗をstaticの関数内で返す(このときuser型に詰める)
class User {
    /**
     * リクエストボディのデータを格納するクラス
     *
     * @param id - ユーザーID
     * @param password - パスワード
     */
    id: string;
    password: string;
    name: string;
    isValid: boolean;

    static createUser(id: string, password: string, name: string): User {
        // ユーザーIDとパスワードのバリデーション
        if (!common.isValidUser(id, password)) {
            return User.createInvalidUser();
        }
        // ユーザーオブジェクトを生成
        return new User(id, password, name, false);
    }

    static createInvalidUser(): User {
        // 無効なユーザーオブジェクトを生成
        return new User(constants.EMPTY_STRING, constants.EMPTY_STRING, constants.EMPTY_STRING, false);
    }

    /**
     * コンストラクタ
     * リクエストボディのデータを初期化する
     *
     * @constructor
     * @param {string} id - ユーザーID
     * @param {string} password - パスワード
     */
    constructor(id: string, password: string, name: string, isValid: boolean) {
        this.id = id;
        this.password = password;
        this.name = name;
        this.isValid = isValid;
    }

    /**
     * ユーザーIDを取得する
     *
     * @public
     * @readonly
     */
    public get getId(): string {
        return this.id;
    }

    /**
     * パスワードを取得する
     *
     * @public
     * @readonly
     */
    public get getPassword(): string {
        return this.password;
    }

    /**
     * リクエストボディの文字列を取得する
     *
     * @public
     * @returns {string}
     */
    public toString(): string {
        return JSON.stringify({
            id: this.id,
            password: this.password,
            name: this.name
        });
    }
}
