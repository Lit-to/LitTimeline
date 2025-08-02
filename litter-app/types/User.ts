import * as common from "../routes/common";
import * as constants from "../routes/constants";
import * as ResponseResult from "./ResponseResult";
import * as dao from "../database/methods/getPassword";
import * as updatePassword from "../database/methods/updatePassword";
import * as insertUser from "../database/methods/insertUser";
import * as removeUser from "../database/methods/removeUser";
import * as config from "../routes/config";

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
    /**
     * ユーザオブジェクト作成メソッド
     * このメソッドはユーザーIDと名前を受け取り、ユーザーオブジェクトを生成する。
     * IDが不正な場合は無効なユーザーオブジェクトを返す。
     *
     * @static
     * @param {string} id - ユーザーID
     * @returns {User} - ユーザーオブジェクト
     */
    static createUser(id: string): User {
        // ユーザーIDとパスワードのバリデーション
        if (User.isValidId(id)) {
            return User.createInvalidUser();
        }
        // ユーザーオブジェクトを生成
        return new User(id, false);
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
        return new User(constants.EMPTY_STRING, false);
    }

    /**
     * コンストラクタ
     * リクエストボディのデータを初期化する
     * @constructor
     * @param {string} id - ユーザーID
     * @param {boolean} isValid - そのユーザが有効かどうか
     */
    private constructor(id: string, isValid: boolean) {
        this.id = id;
        this.isValid = isValid;
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
        // 既にいるかどうかのチェック
        if (!User.isValidId(newId)) {
            return ResponseResult.createFailed(constants.BAD_REQUEST, constants.INVALID_ID_MESSAGE);
        }
        const existResult = await common.isAlreadyExist(newId);
        if (existResult.getIsSuccess()) {
            return ResponseResult.createFailed(constants.BAD_REQUEST, constants.ALREADY_EXISTS_MESSAGE);
        }
        this.setId = newId;
        return ResponseResult.createSuccess();
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
        if (!common.isValidName(newName)) {
            return ResponseResult.createFailed(constants.BAD_REQUEST, constants.INVALID_NAME_MESSAGE);
        }
        this.name = newName;
        return ResponseResult.createSuccess();
    }

    /**
     * 名前変更メソッド
     *
     * @public
     * @param {string} newPassword - 変更先のパスワード
     * @returns {ResponseResult.ResponseResult} - 変更が成功したかどうか
     */
    public async changePassword(newPassword: string): Promise<ResponseResult.ResponseResult> {
        // パスワード変更
        const hashedPassword = await common.encode(newPassword);
        try {
            await updatePassword.updatePassword(this.id, hashedPassword);
            return ResponseResult.createSuccess();
        } catch (error) {
            return ResponseResult.createFailed(constants.INTERNAL_SERVER_ERROR, "データ更新に失敗しました");
        }
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
        if (!common.isValidPassword(password)) {
            return ResponseResult.createFailed(constants.BAD_REQUEST, constants.INVALID_PASSWORD_MESSAGE);
        }
        const hashedPassword = await dao.getPassword(this.id);
        const isMatched = await common.compare(password, hashedPassword.getResult);
        if (!isMatched) {
            // 認証失敗パターン
            return ResponseResult.createFailed(constants.UNAUTHORIZED, constants.UNAUTHORIZED_MESSAGE);
        }
        return ResponseResult.createSuccess();
    }

    /**
     * ユーザ登録メソッド
     * ユーザ名とパスワードを受け取り、ユーザをDBに登録する。
     *
     *
     */
    public async register(name: string, password: string): Promise<ResponseResult.ResponseResult> {
        /*既に登録済みか確認 */
        const existResult = await common.isAlreadyExist(this.id);
        if (existResult.getIsSuccess()) {
            return ResponseResult.createFailed(constants.BAD_REQUEST, constants.ALREADY_EXISTS_MESSAGE);
        }
        // DB登録
        const hashedPassword = await common.encode(password);
        const insertResult = await insertUser.insertUser(this.id, name, hashedPassword);
        if (!insertResult.getIsSuccess()) {
            return ResponseResult.createFailed(constants.INTERNAL_SERVER_ERROR, constants.SEARCH_ERROR_MESSAGE);
        }
        return ResponseResult.createSuccess();
    }
    public async remove(): Promise<ResponseResult.ResponseResult> {
        // ユーザー削除
        const result = await removeUser.removeUser(this.id);
        if (!result.getIsSuccess()) {
            return ResponseResult.createFailed(constants.INTERNAL_SERVER_ERROR, result.getReason());
        }
        this.setId = constants.EMPTY_STRING;
        this.name = constants.EMPTY_STRING;
        this.isValid = false;
        return ResponseResult.createSuccess();
    }
}
export { User };
