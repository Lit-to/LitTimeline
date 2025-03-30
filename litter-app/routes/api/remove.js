async function remove(req) {// ユーザー削除
    result = { result: { success: true, reason: [] }, status: SUCCESS };
    try {
        await pool.query("UPDATE litter.users SET is_deleted = true WHERE user_id = ?", [req.id]);
        result.result.success = true;
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("データ削除に失敗しました");
        result.status = INTERNAL_SERVER_ERROR;
    }
    return result;
}


app.post('/remove', async (req, res) => {// ユーザー削除
    /*
    idとパスワードを受け取り、ユーザーを削除する。
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
    const validationResult = validation(req.body);
    if (!(validationResult.result.success)) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // 認証
    const authResult = await is_correct(req.body); // パスワードが正しいかどうかを確認
    if (!authResult.result.success) {
        res.status(authResult.status).json(authResult.result);
        return;
    }
    // ユーザー削除
    const result = await remove(req.body);// ユーザー削除
    res.status(result.status).json(result.result);
    return;
})
