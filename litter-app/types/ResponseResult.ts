class ResponseResult {
    /**
     * レスポンスの結果を格納するクラス
     *
     * @param status - HTTPステータスコード
     * @param is_success - 処理の成功/失敗
     * @param reason - エラー理由（オプション）
     */
    status: number;
    is_success: boolean;
    reason: string;

    /**
     * レスポンス結果のコンストラクタ
     *
     * @constructor
     * @param {number} status
     * @param {boolean} is_success
     * @param {string} reason
     */
    constructor(status: number, is_success: boolean, reason: string) {
        this.status = status;
        this.is_success = is_success;
        this.reason = reason;
    }

    /**
     * ステータスコードを取得する
     *
     * @returns {number}
     */
    getStatus(): number {
        return this.status;
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
            status: this.status,
            is_success: this.is_success,
            reason: this.reason
        });
    }
}

export { ResponseResult };
