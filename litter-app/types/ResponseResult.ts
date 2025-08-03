import * as result from "./Result.ts";
import * as express from "express";
import * as constants from "../routes/constants.ts";
/**
 * ResponseResultを成功パターンとして作成
 * 理由欄は空欄となり、ステータスコードは成功扱いになる
 *
 * @static
 * @returns {ResponseResult} - 成功レスポンス
 */
export function createSuccess(): ResponseResult {
    return new ResponseResult(true, constants.SUCCESS, constants.EMPTY_STRING);
}

/**
 * ResponseResultを失敗パターンとして作成
 *
 * @static
 * @param {number} status - HTTPステータスコード
 * @param {string} reason - 失敗理由
 * @returns {ResponseResult} - 失敗レスポンス
 */
export function createFailed(status: number, reason: string): ResponseResult {
    return new ResponseResult(false, status, reason);
}

class ResponseResult extends result.Result {
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
     * 指定のリクエストに対するレスポンスを込める
     * @param {express.Response} res - Expressのレスポンスオブジェクト
     * @returns {express.Response} - Expressのレスポンスオブジェクト
     */
    formatResponse(res: express.Response): express.Response {
        return res.status(this.status).json({
            result: {
                isSuccess: this.getIsSuccess,
                reason: this.getReason
            }
        });
    }

    /**
     * レスポンス結果の文字列を取得する
     *
     * @returns {string}
     */

    toString(): string {
        return JSON.stringify({
            status: this.status,
            isSuccess: this.getIsSuccess,
            reason: this.getReason
        });
    }
}

export { ResponseResult };
