import * as CookiesModule from "universal-cookie";

import * as Response from "./types/response.ts";
import * as reactRouterDom from "react-router-dom";
import axios from "axios";

const API_IP = import.meta.env.VITE_API_IP;
const API_PORT = import.meta.env.VITE_API_PORT;
const messageNoResponse: string = "サーバーが応答しません";

const Cookies = CookiesModule.default || CookiesModule;
const cookies = new Cookies();
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

async function responseToJson(response: Response): Promise<Response.ApiResponse> {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

async function logout(navigate: ReturnType<typeof reactRouterDom.useNavigate>) {
    const response = await postEndPoint("logout", {});
    if (response.result.isSuccess) {
        localStorage.removeItem("isLoggedIn");
    }
    navigate("/");
}

async function login(id: string, password: string): Promise<string> {
    const response = await postEndPoint("login", { id, password });
    const sessionId = response.result.data.sessionId;
    if (response.result.isSuccess) {
        localStorage.setItem("isLoggedIn", "true");
        cookies.set("sessionId", sessionId);
    }
    return sessionId;
}

async function getUserIdFromSession(sessionId: string): Promise<string> {
    const response = await getEndPoint(`getUserIdFromSession?sessionId=${sessionId}`);
    if (response.result.isSuccess) {
        return response.result.data.userId;
    } else {
        return "";
    }
}

async function getName(id: string): Promise<string> {
    const response = await postEndPoint("getName", { id: id });
    if (response.result.isSuccess) {
        return response.result.data.name;
    } else {
        return "";
    }
}
async function signUp(id: string, name: string, password: string, reasonFook: Function): Promise<string> {
    // アカウント作成用のクエリを投げる
    axios
        .post("http://" + API_IP + ":" + API_PORT + "/register", { id: id, name: name, password: password }, { withCredentials: true })
        .then((response) => {
            if (response.status === 200) {
                const sessionId = response.data.result.data.sessionId;
                //処理に成功した場合は一時ぺージに飛ばす ログイン後ぺージに遷移予定
                cookies.set("sessionId", sessionId);
                return sessionId;
            }
        })
        .catch((error) => {
            if (error.response) {
                // エラーを受け取ったときはエラー内容をそのまま表示
                reasonFook(error.response.data.reason);
                return "";
            } else if (error.request) {
                // リクエストが送信されたが、応答がない場合
                reasonFook(messageNoResponse);
                return "";
            }
        });
    return "";
}

export { responseToJson, logout, login, getUserIdFromSession, getName, signUp };
