import * as Response from "./types/response.ts";
import * as reactRouterDom from "react-router-dom";

const API_IP = import.meta.env.VITE_API_IP;
const API_PORT = import.meta.env.VITE_API_PORT;

async function getEndPoint(to: string): Promise<Response.ApiResponse> {
    console.log(`http://${API_IP}:${API_PORT}/${to}`);
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

async function login(id: string, password: string) {
    const response = await postEndPoint("login", { id, password });
    if (response.result.isSuccess) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("sessionId", response.result.data.sessionId);
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
    const response = await postEndPoint("getName", { id });
    if (response.result.isSuccess) {
        return response.result.data.name;
    } else {
        return "";
    }
}

export { responseToJson, logout, login, getUserIdFromSession, getName };
