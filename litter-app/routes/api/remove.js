const express = require('express');
const router = express.Router();
const common = require('../common');
const config = require('../config.js');


router.post('/', async (req, res) => {// ユーザー削除
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
    const paramCheckResult = common.check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // 入力規則に合っているかチェック
    const validationResult = common.validation(req.body);
    if (!(validationResult.result.success)) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // 認証
    const authResult = await common.is_correct(req.body); // パスワードが正しいかどうかを確認
    if (!authResult.result.success) {
        res.status(authResult.status).json(authResult.result);
        return;
    }
    // ユーザー削除
    const result = await common.remove(req.body);// ユーザー削除
    res.status(result.status).json(result.result);
    return;
})

module.exports = router;
