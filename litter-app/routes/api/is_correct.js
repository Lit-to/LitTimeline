
async function is_correct(req) {// パスワードが正しいかどうかを確認
    result = { result: { success: true, reason: [] }, status: SUCCESS };
    try {
        const [rows] = await pool.query("SELECT id FROM litter.users WHERE user_id = ? AND password = ?", [req.id, req.password]);
        if (rows.length > 0) {
            result.result.success = true;
        } else {
            result.result.success = false;
            result.result.reason.push("パスワードが正しくありません");
            result.status = BAD_REQUEST;
        }
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("パスワードが正しくありません");
        result.status = BAD_REQUEST;
    }
    return result;
}

app.post('/is_correct', async (req, res) => {
    /*
    idとパスワードを受け取り、パスワードが正しいかどうかを返す。
    パスワードはマスクし、認証を行う。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード'
    }
    */
    // パラメータのチェック
    allowedParams = ['id', 'password']
    const paramCheckResult = check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const result = await is_correct(req.body); // パスワードが正しいかどうかを確認
    res.status(result.status).json(result.result);
    return;
})

