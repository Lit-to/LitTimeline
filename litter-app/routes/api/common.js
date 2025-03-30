

function check_parameters(param, allowedParams) {// パラメータのチェック
    result = { result: { success: true, reason: [] }, status: SUCCESS };
    const receivedParams = Object.keys(param); // リクエストボディのパラメータを取得
    if (receivedParams.length !== allowedParams.length || receivedParams.some(param => !allowedParams.includes(param))) {
        result.result.success = false;
        result.result.reason.push("パラメータが不正です");
        result.status = BAD_REQUEST;
    }
    return result;
}


function validation(value) {// バリデーション
    result = { result: { success: true, reason: [] }, status: SUCCESS };
    // リクエストボディのパラメータ
    if (typeof (value.id) !== "string") {
        result.result.success = false;
        result.result.reason.push("ユーザーIDは文字列で入力してください");
        result.status = BAD_REQUEST;
        return result;
    }
    if (typeof (value.password) !== "string") {
        result.result.success = false;
        result.result.reason.push("パスワードは文字列で入力してください");
        result.status = BAD_REQUEST;
        return result;
    }
    // バリデーション結果を格納するオブジェクト
    result.result.success = false;
    const idValidationResult = idValidPattern.test(value.id);
    const passValidationResult = passValidPattern.test(value.password);
    result.result.success = idValidationResult && passValidationResult;
    if (!idValidationResult) {
        result.result.reason.push("ユーザーIDが不正です");
    }
    if (!passValidationResult) {
        result.result.reason.push("パスワードが不正です");
    }
    return result;
}
