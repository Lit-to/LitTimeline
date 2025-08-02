import { Result } from "../../types/Result";

class QueryResult<T> extends Result {
    /**
     * レスポンスの結果を格納するクラス
     *
     * @param result - クエリ結果
     */
    readonly result: T;

    /**
     * レスポンス結果のコンストラクタ
     *
     * @constructor
     * @param {string} reason - エラー理由
     */
    constructor(isSuccess: boolean, result: T, reason: string) {
        super(isSuccess, reason);
        this.result = result;
    }

    /**
     * クエリ結果を取得する
     *
     * @returns {T} - クエリ結果
     */
    public get getResult(): T {
        return this.result;
    }

    /**
     * レスポンス結果の文字列を取得する
     *
     * @returns {string}
     */
    toString(): string {
        return JSON.stringify({
            result: this.result,
            is_success: this.getIsSuccess(),
            reason: this.getReason()
        });
    }
}

export { QueryResult };
