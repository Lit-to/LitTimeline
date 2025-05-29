const express = require('express');
const router = express.Router();
const config = require('../config.js');


router.get('/', (req, res) => {
    /*
    セッションデータを返却するAPI
    入力: (なし)
    セッションに保存されているユーザーデータを返す。ない場合は空欄オブジェクトを返す。
    */
    if (req.session.user == undefined) {
        res.status(config.SUCCESS).json({ is_success: false, reason: [], data: {} });
    }
    else {
        res.status(config.SUCCESS).json({ is_success: true, reason: [], data: req.session.user });
    }
    return;
});


module.exports = router;
