// 必要なモジュールをインポート
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// ルートエンドポイント
app.get('/', (req, res) => {
    res.render('index', { title: 'test' });
});

// サーバーを起動
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
