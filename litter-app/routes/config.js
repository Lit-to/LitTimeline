var dotenv = require("dotenv");
dotenv.config();
// ================== 定数 ==================
const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 3000;
const idValidPattern = /^[a-zA-Z0-9_]+$/;// ユーザーIDの入力条件(半角英数字とアンダーバーを1文字以上許容)
const passValidPattern = /^[a-zA-Z0-9_]+$/;// パスワードの入力条件(半角英数字とアンダーバーを1文字以上許容)
const SUCCESS = process.env.SUCCESS || 200;
const BAD_REQUEST = process.env.BAD_REQUEST || 400;
const UNAUTHORIZED = process.env.UNAUTHORIZED || 401;
const NOT_FOUND = process.env.NOT_FOUND || 404;
const INTERNAL_SERVER_ERROR = process.env.INTERNAL_SERVER_ERROR || 500
const SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 16;
const PEPPER = process.env.PEPPER || "combex"; // 環境変数から取得、デフォルト値を設定
const ALLOWED_PORT = process.env.ALLOWED_PORT || 3000;
const ALLOWED_IP = process.env.ALLOWED_IP || "localhost";

const CORSOPTION = {
    origin: `http://${ALLOWED_IP}:${ALLOWED_PORT}`,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = {
    HOST,
    PORT,
    idValidPattern,
    passValidPattern,
    SUCCESS,
    BAD_REQUEST,
    UNAUTHORIZED,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
    SALT_ROUNDS,
    PEPPER,
    CORSOPTION,
    ALLOWED_PORT,
    ALLOWED_IP
};
