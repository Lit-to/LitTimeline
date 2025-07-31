class Result {
    /**
     * 結果を格納するクラス
     *
     * @param is_success - 処理の成功/失敗
     * @param reason - エラー理由（オプション）
     */
    readonly is_success: boolean;
    readonly reason: string;

    /**
     * レスポンス結果のコンストラクタ
     *
     * @constructor
     * @param {boolean} is_success
     * @param {string} reason
     */
    constructor(is_success: boolean, reason: string) {
        this.is_success = is_success;
        this.reason = reason;
    }

    /**
     * 処理の成功/失敗を取得する
     *
     * @returns {boolean}
     */
    getIsSuccess(): boolean {
        return this.is_success;
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
            is_success: this.is_success,
            reason: this.reason
        });
    }
}

export { Result };
