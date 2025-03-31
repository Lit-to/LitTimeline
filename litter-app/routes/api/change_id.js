const express = require('express');
const router = express.Router();
const common = require('../common');
const config = require('../config.js');


router.post('/', async (req, res) => {// ユーザーID変更
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
    const paramCheckResult = common.check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const validationResult = common.validation(req.body);
    if (!(validationResult.result.success)) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // 認証
    const authResult = await common.is_correct(req.body); // パスワードが正しいかどうかを認証
    if (!authResult.result.success) {
        res.status(authResult.status).json(authResult.result);
        return;
    }
    // 既にいるかどうかのチェック
    const existResult = await common.is_exist(req.body.new_id);
    if (existResult.result.success) {
        res.status(config.BAD_REQUEST).json({ success: false, reason: "ユーザーが既に存在します" });
        return;
    }
    // 新idのバリデーション
    if (!config.idValidPattern.test(req.body.new_id)) {
        res.status(config.BAD_REQUEST).json({ success: false, reason: "新しいユーザーIDが不正です" });
        return;
    }
    // ユーザーID変更
    const result = await common.change_id(req.body); // ユーザーID変更
    res.status(result.status).json(result.result);
    return;
})

module.exports = router;
