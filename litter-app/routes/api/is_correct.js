const express = require('express');
const router = express.Router();
const common = require('../common');
const config = require('../config.js');


router.post('/', async (req, res) => {
    /*
    idとパスワードを受け取り、パスワードが正しいかどうかを返す。
    パスワードはマスクし、認証を行う。
    入力:
    {
        id: 'ユーザーID',
        password: 'パスワード'
    }
    */
    // パラメータのチェック
    const allowedParams = ['id', 'password'];
    const paramCheckResult = common.check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.is_success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // バリデーション
    const result = await common.is_correct(req.body); // パスワードが正しいかどうかを確認
    res.status(result.status).json(result.result);
    return;
})



module.exports = router;
