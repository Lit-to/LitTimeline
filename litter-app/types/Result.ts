class Result {
    /**
     * 結果を格納するクラス
     *
     * @param is_success - 処理の成功/失敗
     * @param reason - エラー理由（オプション）
     */
    readonly isSuccess: boolean;
    readonly reason: string;

    /**
     * レスポンス結果のコンストラクタ
     *
     * @constructor
     * @param {boolean} isSuccess
     * @param {string} reason
     */
    constructor(isSuccess: boolean, reason: string) {
        this.isSuccess = isSuccess;
        this.reason = reason;
    }

    /**
     * 処理の成功/失敗を取得する
     *
     * @returns {boolean}
     */
    getIsSuccess(): boolean {
        return this.isSuccess;
    }

    /**
     * エラー理由を取得する
     *
     * @returns {(string)}
     */
    getReason(): string {
        return this.reason;
    }

    /**
     * レスポンス結果の文字列を取得する
     *
     * @returns {string}
     */
    toString(): string {
        return JSON.stringify({
            isSuccess: this.isSuccess,
            reason: this.reason
        });
    }
}

export { Result };
