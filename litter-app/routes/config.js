// ================== 定数 ==================
const PORT = process.env.PORT || 3000;
const idValidPattern = /^[a-zA-Z0-9_]+$/;// ユーザーIDの入力条件(半角英数字とアンダーバーを1文字以上許容)
const passValidPattern = /^[a-zA-Z0-9_]+$/;// パスワードの入力条件(半角英数字とアンダーバーを1文字以上許容)
const INTERNAL_SERVER_ERROR = process.env.INTERNAL_SERVER_ERROR || 500;
const BAD_REQUEST = process.env.BAD_REQUEST || 400;
const SUCCESS = process.env.SUCCESS || 200;
const NOT_FOUND = process.env.NOT_FOUND || 404;
const SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 16;
const PEPPER = process.env.PEPPER || "combex"; // 環境変数から取得、デフォルト値を設定

module.exports = {
    PORT,
    idValidPattern,
    passValidPattern,
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    SUCCESS,
    NOT_FOUND,
    SALT_ROUNDS,
    PEPPER
};
