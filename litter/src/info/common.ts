import * as endPoint from "../endPoint.ts";
import * as reactRouterDom from "react-router-dom";

async function getUserIdFromSession(): Promise<string> {
    return await endPoint.getUserIdFromSession();
}

function getUserId(): Promise<string> {
    return getUserIdFromSession().then((id) => {
        return id;
    });
}
function getUserName(): Promise<string> {
    return getUserId().then((id) => endPoint.getName(id));
}
function logout(navigate: ReturnType<typeof reactRouterDom.useNavigate>): Promise<void> {
    return endPoint.logout(navigate);
}

async function login(id: string, password: string): Promise<void> {
    await endPoint.login(id, password);
}

function signUp(id: string, name: string, password: string, setReason: (reason: string) => void): Promise<string> {
    const sessionId = endPoint.signUp(id, name, password, setReason).then((sessionId) => {
        return sessionId;
    });
    return sessionId;
}

export { getUserId, getUserName, logout, login, signUp };
