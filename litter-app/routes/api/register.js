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
    if (!paramCheckResult.result.is_success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // 入力規則に合っているかチェック
    const validationResult = common.validation(req.body);
    if (!validationResult.result.is_success) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }
    // 既にいるかどうかのチェック
    const existResult = await common.is_exist(req.body.id);
    if (existResult.result.is_success) { // 既にいる場合
        res.status(config.BAD_REQUEST).json({ is_success: false, reason: ["ユーザーが既に存在します"] });
        return;
    }
    // ユーザー登録
    const register_result = await common.register(req.body);
    if (!register_result.result.is_success) { // 登録に失敗した場合
        res.status(register_result.status).json(register_result.result);
        return;
    }
    // 登録に成功した場合
    let init_result = await common.init_session(req,req.body.id); // セッションの初期化/idと名前のデータをセッションに保存
    res.status(init_result.status).json(init_result.result);
    return;
});

module.exports = router;
