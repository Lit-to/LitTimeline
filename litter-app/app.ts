import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import * as api from "./routes/api.ts";
import { CORSOPTION, PORT, HOST } from "./routes/config.ts";
dotenv.config();
let secret = process.env.SESSION_SECRET;
if (secret == null) {
    secret = "";
}
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors(CORSOPTION)); // CORSのヘッダー設定
app.use(express.json());
app.use(
    session({
        secret: secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1日
            sameSite: "lax",
            secure: false
        }
    })
);
app.use("/", api.router);

// ================== サーバー起動 ==================
let serverFook = app.listen(PORT, HOST, () => {
    // サーバーを起動
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

export { app, serverFook };
