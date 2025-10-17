import * as CookiesModule from "universal-cookie";

import * as Response from "./types/response.ts";
import * as reactRouterDom from "react-router-dom";

const API_IP = import.meta.env.VITE_API_IP;
const API_PORT = import.meta.env.VITE_API_PORT;

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
    const response = await postEndPoint("login", { id: id, password: password });
    const sessionId = response.result.data.sessionId;
    if (response.result.isSuccess) {
        localStorage.setItem("isLoggedIn", "true");
        cookies.set("sessionId", sessionId);
        return sessionId;
    }
    cookies.set("sessionId", "");
    return "";
}
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


export { responseToJson, logout, login, getUserIdFromSession, getName, signUp };
