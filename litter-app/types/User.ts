import * as common from "../routes/common";
import * as InvalidUserError from "./InvalidUserError";
import * as constants from "../routes/constants";
import * as ResponseResult from "./ResponseResult";
import * as dao from "../dao/methods/getHashedPassword";
class User {
    /**
     * リクエストボディのデータを格納するクラス
     *
     * @param id - ユーザーID
     */
    private id: string;
    private name: string;
    private isValid: boolean;

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
        if (!common.isValidId(id)) {
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
     * ID変更メソッド
     *
     * @public
     * @param {string} newId - 変更先ID
     * @returns {boolean} - 変更が成功したかどうか
     */
    public async changeId(newId: string): Promise<ResponseResult.ResponseResult> {
        // 既にいるかどうかのチェック
        const existResult = await common.isAlreadyExist(newId);
        if (existResult.result.is_success) {
            return new ResponseResult.ResponseResult(false, constants.BAD_REQUEST, constants.ALREADY_EXISTS_MESSAGE);
        }
        if (!common.isValidId(newId)) {
            return new ResponseResult.ResponseResult(false, constants.BAD_REQUEST, "新しいユーザーIDが不正です");
        }
        if (!common.isAlreadyExist(newId)) {
            return new ResponseResult.ResponseResult(false, constants.BAD_REQUEST, "新しいユーザーIDは既に存在します");
        }

        this.setId = newId;
        return new ResponseResult.ResponseResult(true, constants.SUCCESS, "");
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

    public async certify(password: string): Promise<ResponseResult.ResponseResult> {
        // パスワードのバリデーション
        if (!common.isValidPassword(password)) {
            return ResponseResult.createFailed(constants.BAD_REQUEST, constants.INVALID_PASSWORD_MESSAGE);
        }
        const hashedPassword = await dao.getHashedPassword(this.id);
        const isMatched = await common.compare(password, hashedPassword.getResult);
        if (!isMatched) {
            // 認証失敗パターン
            return ResponseResult.createFailed(constants.UNAUTHORIZED, constants.UNAUTHORIZED_MESSAGE);
        }
        return ResponseResult.createSuccess();
    }
}
export { User };
