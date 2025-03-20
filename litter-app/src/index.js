// 必要なモジュールをインポート
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}));

// JSONリクエストを処理できるようにする
app.use((req,res,next)=>{
    const allowedOrigins = ['http://localhost:5173'];
    const origin = req.headers.origin || req.headers.referer;

    if(origin && allowedOrigins.includes(origin)){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
});

// ルートエンドポイント
app.get('/', (req, res) => {

});

// サーバーを起動
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
