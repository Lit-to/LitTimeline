import https from "https";
import http from "http";
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
app.use(cors(CORSOPTION)); // CORSのヘッダー設定
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let serverHook: https.Server | http.Server;
//=================== 開発環境 ===================
if (process.env.NODE_ENV !== "production") {
    (async () => {
        app.get("/is", (req, res) => {
            res.send("{status: 'true'}\n");
        });
        serverHook = http.createServer({}, app).listen(PORT, HOST, () => {
            console.log(`Server running at http://${HOST}:${PORT}/`);
        });
        await SessionManager.SessionManager.init("session_id", "sessions");
    })();
}
//=================== 本番環境 ===================
else {
    serverHook = https.createServer({}, app).listen(PORT, HOST);
}

// ================== ルーティング ==================
app.use("/", api.router);

// ================== サーバー起動 ==================

export { app, serverHook };
