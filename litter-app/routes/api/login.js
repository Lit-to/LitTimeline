const express = require('express');
const router = express.Router();
const common = require('../common.js');
const config = require('../config.js');


router.post('/', async (req, res) => {
    /*
    idをとパスワードを受け取り、ログイン処理を行う。
    成功した場合はセッションidを返却し、失敗した場合はエラーメッセージを返却する。
    入力:
    {
        id: 'ユーザーID'
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
    // 入力チェック
    const validationResult = common.validation(req.body);
    if (!(validationResult.result.is_success)) {
        res.status(validationResult.status).json(validationResult.result);
        return;
    }

    // ユーザーが存在するかどうかを確認 
    const result = await common.is_correct(req.body.id, req.body.password);
    if (result.result.is_success) {
        req.session.user = {
            id: req.body.id,
            name: await common.get_name_from_id(req.body.id)
        };
    }
    else {
        result.result.reason = "ユーザーIDまたはパスワードが間違っています";
        result.result.is_success = false;
        res.status(config.UNAUTHORIZED).json(result.result);
        return;
    }
    res.status(result.status).json(result.result);
    return;
}
)

module.exports = router;
