async function register(req) {// ユーザー登録
    result = { result: { success: true, reason: [] }, status: SUCCESS };
    try {
        await pool.query("INSERT INTO litter.users (user_id, name, password) VALUES (?, ?, ?)", [req.id, req.name, req.password]);
        result.result.success = true;
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("データ挿入に失敗しました");
        result.status = INTERNAL_SERVER_ERROR;
    }
    return result;
}
app.post('/register', async (req, res) => {// ユーザー登録
    /*
    idとパスワードと名前を受け取り、ユーザーを登録する。
    既にユーザが存在している場合は失敗エラーを返す。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード',
        name: '名前'
    }*/
    // パラメータのチェック
    allowedParams = ['id', 'password', 'name']
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
    // 既にいるかどうかのチェック
    const existResult = await is_exist(req.body.id);
    if (existResult.result.success) { // 既にいる場合
        res.status(BAD_REQUEST).json({ success: false, reason: ["ユーザーが既に存在します"] });
        return;
    }
    // ユーザー登録
    const result = await register(req.body);
    res.status(result.status).json(result.result);
    return;
});

