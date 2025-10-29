import * as common from "../routes/common.ts";
import * as constants from "../routes/constants.ts";
import * as ResponseResult from "./ResponseResult.ts";
import * as config from "../routes/config.ts";
import * as db from "../database/dbConnection.ts";

class User {
    /**
     * リクエストボディのデータを格納するクラス
     *
     * @param id - ユーザーID
     */
    private id: string;
    private name: string;
    private isValid: boolean;

    static isValidId(id: string): boolean {
        // IDのバリデーション/IDが正規表現に当てはまるかどうかをチェック
        return config.idValidPattern.test(id);
    }
    static isValidName(name: string): boolean {
        // 名前のバリデーションに関しては、特に現時点で設定の予定はないため全通過。ただし、将来的に名前のバリデーションが必要になった場合はここを変更する
        return true;
    }

    static isValidPassword(password: string): boolean {
        // パスワードのバリデーション/パスワードが正規表現に当てはまるかどうかをチェック
        return config.passValidPattern.test(password);
    }

    /**
     * ユーザオブジェクト作成メソッド
     * このメソッドはユーザーIDと名前を受け取り、ユーザーオブジェクトを生成する。
     * IDが不正な場合は無効なユーザーオブジェクトを返す。
     *
     * @static
     * @param {string} id - ユーザーID
     * @returns {User} - ユーザーオブジェクト
     */
    static async createUser(id: string): Promise<User> {
        // ユーザーIDとパスワードのバリデーション
        if (!User.isValidId(id)) {
            return User.createInvalidUser();
        }
        const name = (await db.getName.getName(id)).getResult;
        // ユーザーオブジェクトを生成
        return new User(id, name, true);
    }

    /**
     * 無効なユーザーオブジェクトを生成する
     * このメソッドはユーザーIDが不正な場合に使用される。
     *
     * @static
     * @returns {User} - 無効なユーザーオブジェクト
     */
    static createInvalidUser(): User {
        // 無効なユーザーオブジェクトを生成
        return new User(constants.EMPTY_STRING, constants.EMPTY_STRING, false);
    }

    /**
     * コンストラクタ
     * リクエストボディのデータを初期化する
     * @constructor
     * @param {string} id - ユーザーID
     * @param {boolean} isValid - そのユーザが有効かどうか
     */
    private constructor(id: string, name: string, isValid: boolean) {
        this.id = id;
        this.isValid = isValid;
        this.name = name;
    }

    /**
     * ユーザーIDを取得する
     *
     * @public
     * @readonly
     * @returns {string} - ユーザーID
     */
    public get getId(): string {
        return this.id;
    }

    /**
     * ユーザー名を取得する
     *
     * @public
     * @readonly
     * @returns {string} - ユーザー名
     */
    public get getName(): string {
        return this.name;
    }

    /**
     * ユーザーが有効かどうかを取得する
     *
     * @public
     * @readonly
     * @type {boolean}
     */
    public get getIsValid(): boolean {
        return this.isValid;
    }

    /**
     * ID変更メソッド
     *
     * @public
     * @param {string} newId - 変更先ID
     * @returns {boolean} - 変更が成功したかどうか
     */
    public async changeId(newId: string): Promise<ResponseResult.ResponseResult> {
        // IDが正規表現に当てはまるかどうかをチェック
        if (!User.isValidId(newId)) {
            return ResponseResult.ResponseResult.createFailed(constants.BAD_REQUEST, constants.MESSAGE_ID_INVALID);
        }
        const existResult = await common.isNotAlreadyUsed(newId);
        if (!existResult.getIsSuccess) {
            return ResponseResult.ResponseResult.createFailed(constants.BAD_REQUEST, constants.MESSAGE_ALREADY_USED);
        }
        const updateResult = await db.updateId.updateId(this.id, newId);
        if (!updateResult.getIsSuccess) {
            return ResponseResult.ResponseResult.createFailed(constants.INTERNAL_SERVER_ERROR, updateResult.getReason);
        }
        this.setId = newId;
        return ResponseResult.ResponseResult.createSuccess();
    }

    /**
     * 名前変更メソッド
     *
     * @public
     * @param {string} newName - 変更先の名前
     * @returns {ResponseResult.ResponseResult} - 変更が成功したかどうか
     */
    public async changeName(newName: string): Promise<ResponseResult.ResponseResult> {
        // 名前のバリデーション
        if (!User.isValidName(newName)) {
            return ResponseResult.ResponseResult.createFailed(constants.BAD_REQUEST, constants.MESSAGE_NAME_INVALID);
        }
        const updateResult = await db.updateName.updateName(this.id, newName);
        if (!updateResult.getIsSuccess) {
            return ResponseResult.ResponseResult.createFailed(constants.INTERNAL_SERVER_ERROR, updateResult.getReason);
        }
        this.setName = newName;
        return ResponseResult.ResponseResult.createSuccess();
    }

    /**
     * パスワード変更メソッド
     *
     * @public
     * @param {string} newPassword - 変更先のパスワード
     * @returns {ResponseResult.ResponseResult} - 変更が成功したかどうか
     */
    public async changePassword(newPassword: string): Promise<ResponseResult.ResponseResult> {
        if (!User.isValidPassword(newPassword)) {
            return ResponseResult.ResponseResult.createFailed(constants.BAD_REQUEST, constants.MESSAGE_PASSWORD_INVALID);
        }
        // パスワード変更
        try {
            await db.updatePassword.updatePassword(this.id, newPassword);
            return ResponseResult.ResponseResult.createSuccess();
        } catch (error) {
            return ResponseResult.ResponseResult.createFailed(constants.INTERNAL_SERVER_ERROR, "データ更新に失敗しました");
        }
    }

    /**
     * ユーザ名を設定する
     *
     * @private
     * @param {string} name - ユーザ名
     * @returns {*}
     */
    private set setName(name: string) {
        this.name = name;
    }
    /**
     * ユーザIDを設定する
     *
     * @private
     * @param {string} id - ユーザーID
     */
    private set setId(id: string) {
        this.id = id;
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
            name: this.name
        });
    }

    /**
     * ユーザー認証メソッド
     * パスワードを受け取り、DB情報と照合する。
     *
     * @public
     * @async
     * @param {string} password
     * @returns {Promise<ResponseResult.ResponseResult>}
     */
    public async certify(password: string): Promise<ResponseResult.ResponseResult> {
        // パスワードのバリデーション
        if (!User.isValidPassword(password)) {
            return ResponseResult.ResponseResult.createFailed(constants.BAD_REQUEST, constants.MESSAGE_PASSWORD_INVALID);
        }
        const hashedPassword = (await db.getPassword.getPassword(this.id)).getResult;
        const isMatched = await common.compare(password, hashedPassword);
        if (!isMatched) {
            // 認証失敗パターン
            return ResponseResult.ResponseResult.createFailed(constants.UNAUTHORIZED, constants.MESSAGE_UNAUTHORIZED);
        }
        return ResponseResult.ResponseResult.createSuccess();
    }

    /**
     * ユーザ登録メソッド
     * ユーザ名とパスワードを受け取り、ユーザをDBに登録する。
     *
     *
     */
    public async register(name: string, password: string): Promise<ResponseResult.ResponseResult> {
        if (!User.isValidName(name)) {
            return ResponseResult.ResponseResult.createFailed(constants.BAD_REQUEST, constants.MESSAGE_NAME_INVALID);
        }
        if (!User.isValidPassword(password)) {
            return ResponseResult.ResponseResult.createFailed(constants.BAD_REQUEST, constants.MESSAGE_PASSWORD_INVALID);
        }
        /*既に登録済みか確認 */
        const existResult = await common.isNotAlreadyUsed(this.id);
        if (!existResult.getIsSuccess) {
            return ResponseResult.ResponseResult.createFailed(constants.BAD_REQUEST, constants.MESSAGE_ALREADY_USED);
        }
        // DB登録
        const insertResult = await db.insertUser.insertUser(this.id, name, password);
        if (!insertResult.getIsSuccess) {
            return ResponseResult.ResponseResult.createFailed(constants.INTERNAL_SERVER_ERROR, constants.MESSAGE_SEARCH_ERROR);
        }
        return ResponseResult.ResponseResult.createSuccess();
    }

    /**
     * ユーザー削除メソッド
     *
     * @public
     * @async
     * @returns {Promise<ResponseResult.ResponseResult>}
     */
    public async remove(): Promise<ResponseResult.ResponseResult> {
        if (!User.isValidId(this.id)) {
            return ResponseResult.ResponseResult.createFailed(constants.BAD_REQUEST, constants.MESSAGE_ID_INVALID);
        }
        // ユーザー削除
        const result = await db.removeUser.removeUser(this.id);
        if (!result.getIsSuccess) {
            return ResponseResult.ResponseResult.createFailed(constants.INTERNAL_SERVER_ERROR, result.getReason);
        }
        this.setId = constants.EMPTY_STRING;
        this.name = constants.EMPTY_STRING;
        this.isValid = false;
        return ResponseResult.ResponseResult.createSuccess();
    }
}
export { User };
