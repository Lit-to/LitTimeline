const express = require('express');
const router = express.Router();
const common = require('../common');
const config = require('../config.js');

router.post('/', async (req, res) => {
    /*
    idと新しいパスワードを受け取り、パスワードを変更する。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード',
        new_password: '新しいパスワード'
    }    
    */
    // パラメータのチェック
    const allowedParams = ['id', 'password', 'new_password'];
    const paramCheckResult = common.check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.is_success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const validationResult = common.validation(req.body);
    if (!validationResult.result.is_success) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // 認証
    const authResult = await common.is_correct(req.body); // パスワードが正しいかどうかを確認
    if (!authResult.result.is_success) {
        res.status(authResult.status).json(authResult.result);
        return;
    }
    // 新パスワードのバリデーション
    if (!config.passValidPattern.test(req.body.new_password)) {
        res.status(config.BAD_REQUEST).json({ is_success: false, reason: ["新しいパスワードが不正です"] });
        return;
    }
    // パスワード変更
    const result = await common.change_password(req.body);
    res.status(result.status).json(result.result);
    return;
})



module.exports = router;
