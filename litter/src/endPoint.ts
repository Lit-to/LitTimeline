import * as CookiesModule from "universal-cookie";

import * as Response from "./types/response.ts";
import * as reactRouterDom from "react-router-dom";

const API_IP = import.meta.env.VITE_API_IP;
const API_PORT = import.meta.env.VITE_API_PORT;

const Cookies = CookiesModule.default || CookiesModule;
const cookies = new Cookies();

/**
 * GETリクエストを送る
 *
 * @async
 * @param {string} to - エンドポイント名
 * @returns {Promise<Response.ApiResponse>} - APIのレスポンス
 */
async function getEndPoint(to: string): Promise<Response.ApiResponse> {
    try {
        const response = await fetch(`http://${API_IP}:${API_PORT}/${to}`, {
            method: "GET",
            credentials: "include",
            headers: {
                Pragma: "no-cache",
                "If-Modified-Since": "0",
            },
        });

        return await responseToJson(response);
    } catch (error) {
        console.error("Error:", error);
        return Promise.resolve({
            result: { isSuccess: false, reason: "", data: {} },
        });
    }
}

/**
 * POSTリクエストを送る
 *
 * @async
 * @param {string} to - エンドポイント名
 * @param {object} requestBody - リクエストボディ
 * @returns {Promise<Response.ApiResponse>} - APIのレスポンス
 */
async function postEndPoint(to: string, requestBody: object): Promise<Response.ApiResponse> {
    try {
        const response = await fetch(`http://${API_IP}:${API_PORT}/${to}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Pragma: "no-cache",
                "If-Modified-Since": "0",
            },
            body: JSON.stringify(requestBody),
        });

        return await responseToJson(response);
    } catch (error) {
        console.error("Error:", error);
        return Promise.resolve({
            result: { isSuccess: false, reason: "", data: {} },
        });
    }
}

/**
 * レスポンスをJSON形式の文字列に変換
 *
 * @async
 * @param {Response} response - フェッチのレスポンスオブジェクト
 * @returns {Promise<Response.ApiResponse>} - 変換されたJSONオブジェクト
 */
async function responseToJson(response: Response): Promise<Response.ApiResponse> {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

/**
 * ログアウトAPI関数
 *
 * @async
 * @param {ReturnType<typeof reactRouterDom.useNavigate>} navigate - ログアウト後移動するための移動関数
 */
async function logout(navigate: ReturnType<typeof reactRouterDom.useNavigate>): Promise<void> {
    const response = await postEndPoint("logout", {});
    if (response.result.isSuccess) {
        localStorage.removeItem("isLoggedIn");
    }
    navigate("/");
}

/**
 * ログインAPI関数
 * ログイン試行を行う。失敗した場合は空文字を返す。
 * @async
 * @param {string} id - ユーザーID
 * @param {string} password - パスワード
 * @returns {Promise<boolean>} - セッションID
 */
async function login(id: string, password: string): Promise<boolean> {
    const response = await postEndPoint("login", { id: id, password: password });
    if (response.result.isSuccess) {
        localStorage.setItem("isLoggedIn", "true");
        return true;
    }
    return false;
}

/**
 * アカウント生成関数
 *
 * @async
 * @param {string} id - ユーザーID
 * @param {string} name - ユーザー名
 * @param {string} password - パスワード
 * @param {Function} reasonFook - エラー表示関数
 * @returns {Promise<string>} - セッションID
 */
async function signUp(id: string, name: string, password: string, reasonFook: Function): Promise<string> {
    // アカウント作成用のクエリを投げる
    const response = await postEndPoint("register", { id: id, name: name, password: password });
    if (response.result.isSuccess) {
        const sessionId = response.result.data.sessionId;
        //処理に成功した場合は一時ぺージに飛ばす ログイン後ぺージに遷移予定
        cookies.set("sessionId", sessionId);
        return sessionId;
    } else {
        // エラーを受け取ったときはエラー内容をそのまま表示
        reasonFook(response.result.reason);
        return "";
    }
}

/**
 * セッション情報からユーザーIDを取得する
 * ※セッション情報は自動でクッキーに含まれる想定
 * @async
 * @returns {Promise<string>} - ユーザーID
 */
async function getUserIdFromSession(): Promise<string> {
    const response = await getEndPoint(`getUserIdFromSession`);
    if (response.result.isSuccess) {
        return response.result.data.userId;
    } else {
        return "";
    }
}

/**
 * ユーザーidからユーザー名を取得する関数
 *
 * @async
 * @param {string} id - ユーザーID
 * @returns {Promise<string>} - ユーザー名
 */
async function getName(id: string): Promise<string> {
    const response = await postEndPoint("getName", { id: id });
    if (response.result.isSuccess) {
        return response.result.data.name;
    } else {
        return "";
    }
}

/**
 * ポスト内容を送る関数
 *
 * @async
 * @param {string} title - ポストタイトル
 * @param {string} content - ポスト内容
 * @returns {Promise<boolean>} - 成功したかどうか
 */
async function createPost(title: string, content: string): Promise<boolean> {
    const response = await postEndPoint("createPost", { title: title, content: content });
    return response.result.isSuccess;
}

export { responseToJson, logout, login, getUserIdFromSession, getName, signUp, createPost };
