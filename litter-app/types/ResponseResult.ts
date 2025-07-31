import { Result } from "./Result";

class ResponseResult extends Result {
    /**
     * レスポンスの結果を格納するクラス
     *
     * @param status - HTTPステータスコード
     */
    readonly status: number;

    /**
     * レスポンス結果のコンストラクタ
     *
     * @constructor
     * @param {string} reason - エラー理由
     */
    constructor(isSuccess: boolean, status: number, reason: string) {
        super(isSuccess, reason);
        this.status = status;
    }

    /**
     * ステータスコードを取得する
     *
     * @returns {number} - HTTPステータスコード
     */
    getStatus(): number {
        return this.status;
    }

    /**
     * レスポンス結果の文字列を取得する
     *
     * @returns {string}
     */
    toString(): string {
        return JSON.stringify({
            status: this.status,
            isSuccess: this.getIsSuccess(),
            reason: this.getReason()
        });
    }
}

export { ResponseResult };
