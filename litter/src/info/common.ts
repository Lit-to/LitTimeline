import * as endPoint from "../endPoint.ts";
import * as reactRouterDom from "react-router-dom";
import * as CookiesModule from "universal-cookie";
const Cookies = CookiesModule.default || CookiesModule;
const cookies = new Cookies();
function getUserIdFromSession(): Promise<string> {
    const sessionId = cookies.get("sessionId");
    if (!sessionId) {
        throw new Error("No sessionId cookie found");
    }
    return endPoint.getUserIdFromSession(sessionId);
}

function getUserId(): Promise<string> {
    return getUserIdFromSession().then((id) => {return id;});
}
function getUserName(): Promise<string> {
    return getUserId().then((id) => endPoint.getName(id));
}
function logout(navigate: ReturnType<typeof reactRouterDom.useNavigate>): Promise<void> {
    return endPoint.logout(navigate);
}

function login(id:string, password:string): Promise<string> {
    const sessionId = endPoint.login(id, password).then((sessionId) => { return sessionId; });
    return sessionId;
}

function signUp(id:string, name:string, password:string, setReason: (reason: string) => void): Promise<string> {
    const sessionId = endPoint.signUp(id, name, password, setReason).then((sessionId) => { return sessionId; });
    return sessionId;
}

export { getUserId, getUserName, logout, login, signUp };

