var session = require("express-session");
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require("cors");
var app = express();
const { CORSOPTION, PORT, HOST,} = require('./routes/config.js');

var dotenv = require("dotenv");
dotenv.config();

var apiRouter = require('./routes/api.js');
const { title } = require("process");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(cors(CORSOPTION)) // CORSのヘッダー設定
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1日
            sameSite: 'lax',
            secure: false
        }
    })
)
app.use('/', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        title: "error"
    });
});
app.options('*', cors());
// ================== サーバー起動 ==================
app.listen(PORT, HOST, () => { // サーバーを起動
    console.log(`Server is running on http://${HOST}:${PORT}`);
});


module.exports = app;
