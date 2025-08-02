import { config } from "dotenv";
config();
// ================== 定数 ==================
const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT);
const idValidPattern = /^[a-zA-Z0-9_]+$/; // ユーザーIDの入力条件(半角英数字とアンダーバーを1文字以上許容)
const passValidPattern = /^[a-zA-Z0-9_]+$/; // パスワードの入力条件(半角英数字とアンダーバーを1文字以上許容)
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 16;
const PEPPER = process.env.PEPPER;
const ALLOWED_PORT = process.env.ALLOWED_PORT || 3000;
const ALLOWED_IP = process.env.ALLOWED_IP || "localhost";

const CORSOPTION = {
    origin: `http://${ALLOWED_IP}:${ALLOWED_PORT}`,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200
};

const ERROR_MESSAGES = {
    INVALID_USER: "無効なユーザー情報です"
};

export { HOST, PORT, idValidPattern, passValidPattern, SALT_ROUNDS, PEPPER, CORSOPTION, ALLOWED_PORT, ALLOWED_IP, ERROR_MESSAGES };
