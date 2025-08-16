/**
 * APIレスポンスを表す型
 *
 * @typedef {Response} APIレスポンス
 */
type ApiResponse = {
    Result:{
        isSuccess: boolean; // 処理の成功/失敗
        reason: string; // エラー理由
    }
    data: any; // 返却データ
}