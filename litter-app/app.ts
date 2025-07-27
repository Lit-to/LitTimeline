import express from "express";
import session from "express-session";
import createError from "http-errors";
import cors from "cors";
import * as path from "path";
import logger from "morgan";
import dotenv from "dotenv";
import * as api from "./routes/api.ts";
import { CORSOPTION, PORT, HOST } from "./routes/config.ts";
dotenv.config();

var app = express();
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(cors(CORSOPTION)); // CORSのヘッダー設定
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error", {
        title: "error"
    });
});
// ================== サーバー起動 ==================
app.listen(PORT, HOST, () => {
    // サーバーを起動
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

export default app;
