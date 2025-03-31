// ================== 定数 ==================
const PORT = process.env.PORT || 3000;
const idValidPattern = /^[a-zA-Z0-9_]+$/;// ユーザーIDの入力条件(半角英数字とアンダーバーを1文字以上許容)
const passValidPattern = /^[a-zA-Z0-9_]+$/;// パスワードの入力条件(半角英数字とアンダーバーを1文字以上許容)

const INTERNAL_SERVER_ERROR = 500;
const BAD_REQUEST = 400;
const SUCCESS = 200;
const NOT_FOUND = 404;


module.exports = {
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    SUCCESS,
    idValidPattern,
    passValidPattern,
    NOT_FOUND,
    PORT
};
