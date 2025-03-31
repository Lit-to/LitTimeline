const express = require('express');
const router = express.Router();
const common = require('../common');
const config = require('../config.js');

router.post('/', async (req, res) => {// ユーザー登録
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
    const allowedParams = ['id', 'password', 'name'];
    const paramCheckResult = common.check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // 入力規則に合っているかチェック
    const validationResult = common.validation(req.body);
    if (!validationResult.result.success) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // 既にいるかどうかのチェック
    const existResult = await common.is_exist(req.body.id);
    if (existResult.result.success) { // 既にいる場合
        res.status(config.BAD_REQUEST).json({ success: false, reason: ["ユーザーが既に存在します"] });
        return;
    }
    // ユーザー登録
    const result = await common.register(req.body);
    res.status(result.status).json(result.result);
    return;
});

module.exports = router;
