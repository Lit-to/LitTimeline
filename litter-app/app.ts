import https from "https";
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

//=================== 開発環境 ===================
if (process.env.NODE_ENV !== "production") {
    (async () => {
        const https = await import("http");
        app.get("/is", (req, res) => {
            res.send("{status: 'true'}\n");
        });
        https.createServer({}, app).listen(PORT, HOST, () => {
            console.log(`Server running at http://${HOST}:${PORT}/`);
        });
    })();
}

// ================== ルーティング ==================
app.use("/", api.router);

// ================== サーバー起動 ==================

const serverFook = app;

export { app, serverFook };
