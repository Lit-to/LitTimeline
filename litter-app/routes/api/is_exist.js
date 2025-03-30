async function is_exist(value) {// ユーザーが存在するかどうかを確認
    let result = { result: { success: true, reason: [] }, status: SUCCESS };
    try {
        const [rows] = await pool.query("SELECT id FROM litter.users WHERE user_id = ? and is_deleted = false", value);
        if (rows.length > 0) {
            result.result.success = true;
        } else {
            result.result.success = false;
            result.result.reason.push("ユーザーが存在しません");
        }
    } catch (error) {
        result.result.success = false;
        result.result.reason.push("ユーザーが存在しません");
        result.status = INTERNAL_SERVER_ERROR;

    }
    return result;
}

app.post('/is_not_exist', async (req, res) => {
    /*
    idを受け取り、ユーザーが存在するかどうかを返す。
    入力:
    {
        id: 'ユーザーID'
    }
    */
    // パラメータのチェック
    const allowedParams = ['id']
    const paramCheckResult = check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // ユーザーが存在するかどうかを確認 
    // 本来ユーザが存在するか否かを返すべきだが、性質上｢いない｣場合に注目しているので逆転させている
    const result = await is_exist(req.body.id);
    result.result.success = !result.result.success;
    result.result.reason = ["ユーザーが既に存在します"];
    res.status(result.status).json(result.result);
    return;
}
)

