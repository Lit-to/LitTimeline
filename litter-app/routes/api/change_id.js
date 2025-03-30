
async function change_id(req) {// id変更
    result = { result: { success: true, reason: [] }, status: SUCCESS };
    try {
        await pool.query("UPDATE litter.users SET user_id = ? WHERE user_id = ?", [req.new_id, req.id]);
        result.result.success = true
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("データ更新に失敗しました");
        result.status = INTERNAL_SERVER_ERROR;
    }
    return result;
}



app.post('/change_id', async (req, res) => {// ユーザーID変更
    /*
    idと新しいユーザーIDを受け取り、ユーザーIDを変更する。
    
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード',
        new_id: '新しいユーザーID'
    }
    */
    // パラメータのチェック
    allowedParams = ['id', 'password', 'new_id']
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
    const authResult = await is_correct(req.body); // パスワードが正しいかどうかを認証
    if (!authResult.result.success) {
        res.status(authResult.status).json(authResult.result);
        return;
    }
    // 既にいるかどうかのチェック
    const existResult = await is_exist(req.body.new_id);
    if (existResult.result.success) {
        res.status(BAD_REQUEST).json({ success: false, reason: "ユーザーが既に存在します" });
        return;
    }
    // 新idのバリデーション
    if (!idValidPattern.test(req.body.new_id)) {
        res.status(BAD_REQUEST).json({ success: false, reason: "新しいユーザーIDが不正です" });
        return;
    }
    // ユーザーID変更
    const result = await change_id(req.body); // ユーザーID変更
    res.status(result.status).json(result.result);
    return;
})

