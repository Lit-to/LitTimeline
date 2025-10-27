import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as api from "./routes/api.ts";
import { CORSOPTION, PORT, HOST } from "./routes/config.ts";
import * as SessionManager from "./types/SessionManager.ts";
import cookieParser from "cookie-parser";

dotenv.config();
let secret = process.env.SESSION_SECRET;
if (secret == null) {
    secret = "";
}
var app = express();

// セッションの初回起動
SessionManager.SessionManager.init("session_id", "sessions");

app.use(express.urlencoded({ extended: true }));
app.use(cors(CORSOPTION)); // CORSのヘッダー設定
app.use(express.json());
app.use(cookieParser());

// ================== ルーティング ==================
app.use("/", api.router);

// ================== サーバー起動 ==================
let serverFook = app.listen(PORT, HOST, () => {
    // サーバーを起動
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

export { app, serverFook };
