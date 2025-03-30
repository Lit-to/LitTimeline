async function change_password(req) {// パスワード変更
    result = { result: { success: true, reason: [] }, status: SUCCESS };
    try {
        await pool.query("UPDATE litter.users SET password = ? WHERE user_id = ?", [req.new_password, req.id]);
        result.result.success = true;
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("データ更新に失敗しました");
        result.status = INTERNAL_SERVER_ERROR;
    }
    return result;
}

app.post('/change_password', async (req, res) => {
    /*
    idと新しいパスワードを受け取り、パスワードを変更する。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード',
        new_password: '新しいパスワード
    }    
    */
    // パラメータのチェック
    allowedParams = ['id', 'password', 'new_password']
    const paramCheckResult = check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const validationResult = validation(req.body);
    if (!validationResult.result.success) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // 認証
    const authResult = await is_correct(req.body); // パスワードが正しいかどうかを確認
    if (!authResult.result.success) {
        res.status(authResult.status).json(authResult.result);
        return;
    }
    // 新パスワードのバリデーション
    if (!passValidPattern.test(req.body.new_password)) {
        res.status(BAD_REQUEST).json({ success: false, reason: ["新しいパスワードが不正です"] });
        return;
    }
    // パスワード変更
    const result = await change_password(req.body);
    res.status(result.status).json(result.result);
    return;
})

