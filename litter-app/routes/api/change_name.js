const express = require('express');
const router = express.Router();
const common = require('../common');
const config = require('../config.js');


router.post('/', async (req, res) => {// 名前変更
    /*
    idと新しい名前を受け取り、名前を変更する。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード',
        new_name: '新しい名前
    }
    */
    // パラメータのチェック
    allowedParams = ['id', 'password', 'new_name']
    const paramCheckResult = common.check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const validationResult = common.validation(req.body);
    if (!validationResult.result.success) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // パスワードが正しいかどうかを確認
    const authResult = await common.is_correct(req.body); // パスワードが正しいかどうかを確認
    if (!authResult.result.success) {
        res.status(authResult.status).json(authResult.result);
        return;
    }
    // 名前変更
    const result = await common.change_name(req.body);
    res.status(result.status).json(result.result);
    return;
}
)

module.exports = router;
