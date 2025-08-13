import * as result from "./Result.ts";
import * as express from "express";
import * as constants from "../routes/constants.ts";
class ResponseResult extends result.Result {
    /**
     * ResponseResultを成功パターンとして作成
     * 理由欄は空欄となり、ステータスコードは成功扱いになる
     * @note 返却データが存在しない場合。
     * @static
     * @returns {ResponseResult} - 成功レスポンス
     */
    public static createSuccess(): ResponseResult {
        return new ResponseResult(true, constants.SUCCESS, constants.EMPTY_STRING, {});
    }

    /**
     * ResponseResultを成功パターンとして作成
     * 理由欄は空欄となり、ステータスコードは成功扱いになる
     * @note 返却データが存在する場合。
     * @static
     * @param {any} data - 返却データ
     * @returns {ResponseResult}
     */
    public static createSuccessWithData(data: any): ResponseResult {
        return new ResponseResult(true, constants.SUCCESS, constants.EMPTY_STRING, data);
    }

    /**
     * ResponseResultを失敗パターンとして作成
     * @static
     * @param {number} status - HTTPステータスコード
     * @param {string} reason - 失敗理由
     * @returns {ResponseResult} - 失敗レスポンス
     */
    public static createFailed(status: number, reason: string): ResponseResult {
        return new ResponseResult(false, status, reason, {});
    }

    /**
     * レスポンスの結果を格納するクラス
     * @param status - HTTPステータスコード
     * @param data - 返却データ(存在する場合)
     * @param reason - 理由(成功の場合は空文字列)
     */
    readonly status: number;
    readonly data: any;

    /**
     * レスポンス結果のコンストラクタ
     *
     * @constructor
     * @param {boolean} isSuccess - 処理の成功/失敗
     * @param {number} status - HTTPステータスコード
     * @param {string} reason - エラー理由(成功時は空文字列)
     * @param {any} data - 返却データ
     */
    private constructor(isSuccess: boolean, status: number, reason: string, data: any) {
        super(isSuccess, reason);
        this.status = status;
        this.data = data;
    }

    /**
     * ステータスコードを取得する
     * @returns {number} - HTTPステータスコード
     */
    public get getStatus(): number {
        return this.status;
    }

    /**
     * 指定のリクエストに対するレスポンスを込める
     * @param {express.Response} res - Expressのレスポンスオブジェクト
     * @returns {express.Response} - Expressのレスポンスオブジェクト
     */
    public formatResponse(res: express.Response): express.Response {
        return res.status(this.status).json({
            result: {
                isSuccess: this.getIsSuccess,
                reason: this.getReason,
                data: this.data
            }
        });
    }

    /**
     * レスポンス結果の文字列を取得する
     * @returns {string}
     */
    public toString(): string {
        return JSON.stringify({
            status: this.status,
            isSuccess: this.getIsSuccess,
            reason: this.getReason
        });
    }
}

export { ResponseResult };
