class Result {
    /**
     * 結果を格納するクラス
     * @param isSuccess - 処理の成功/失敗
     * @param reason - エラー理由
     */
    readonly isSuccess: boolean;
    readonly reason: string;

    /**
     * レスポンス結果のコンストラクタ
     *
     * @constructor
     * @param {boolean} isSuccess - 処理の成功/失敗
     * @param {string} reason - エラー理由
     */
    constructor(isSuccess: boolean, reason: string) {
        this.isSuccess = isSuccess;
        this.reason = reason;
    }

    /**
     * API処理の成功/失敗を取得する
     *
     * @returns {boolean} - 成功の場合True、失敗の場合False
     */
    get getIsSuccess(): boolean {
        return this.isSuccess;
    }

    /**
     * エラー理由を取得する
     *
     * @returns {string} - エラー理由(成功時は空文字列)
     */
    get getReason(): string {
        return this.reason;
    }

    /**
     * レスポンス結果の文字列を取得する
     *
     * @returns {string} - レスポンス結果の文字列
     */
    toString(): string {
        return JSON.stringify({
            isSuccess: this.isSuccess,
            reason: this.reason
        });
    }
}

export { Result };
