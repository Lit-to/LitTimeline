const express = require('express');
const router = express.Router();
const common = require('../common');
const config = require('../config.js');

router.post('/', async (req, res) => {
    /*
    idを受け取り、ユーザーが存在するかどうかを返す。
    入力:
    {
        id: 'ユーザーID'
    }
    */
    // パラメータのチェック
    const allowedParams = ['id']
    const paramCheckResult = common.check_parameters(req.body, allowedParams);
    if (!paramCheckResult.result.success) {
        res.status(paramCheckResult.status).json(paramCheckResult.result);
        return;
    }
    // 入力チェック
    req.body.password = "pass";
    const validationResult = common.validation(req.body);
    if (!(validationResult.result.success)) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }

    // ユーザーが存在するかどうかを確認 
    // 本来ユーザが存在するか否かを返すべきだが、性質上｢いない｣場合に注目しているので逆転させている
    const result = await common.is_exist(req.body.id);
    if (result.result.success) {
        result.result.reason = ["ユーザーが既に存在します"];
        result.result.success = false;

    }
    else {
        result.result.reason = [];
        result.result.success = true;
    }
    res.status(result.status).json(result.result);
    return;
}
)

module.exports = router;
