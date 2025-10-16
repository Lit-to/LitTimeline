import * as reactRouterDom from "react-router-dom";
import styles from "./app.module.css";
import * as react from "react";
import * as endPoint from "../endPoint.ts";

async function getUserId(sessionId: string): Promise<string> {
    return await endPoint.getUserIdFromSession(sessionId);
}
async function getUserName(userId: string): Promise<string> {
    return await endPoint.getName(userId);
}

function SessionInfo(): react.JSX.Element {
    const [userId, setUserId] = react.useState<string | null>(null);
    const [userName, setUserName] = react.useState<string | null>(null);
    react.useEffect(() => {
        const sessionId = localStorage.getItem("sessionId");
        if (sessionId == null) {
            return;
        }
        getUserId(sessionId).then((id) => setUserId(id));
    }, []);
    react.useEffect(() => {
        if (userId != null) {
            getUserName(userId).then((name) => setUserName(name));
        }
    }, [userId]);
    if (userId == null) {
        return <p>id情報取得中..</p>;
    }
    if (userName == null) {
        return <p>名前情報取得中..</p>;
    }

    return (
        <div>
            <h3>セッション情報</h3>
            <p>ID: {userId}</p>
            <p>名前:{userName} </p>
        </div>
    );
}

function Temp() {
    const navigate = reactRouterDom.useNavigate();
    async function logout() {
        await endPoint.logout(navigate);
    }
    const title: string = "Tlitter";
    return (
        <div className={styles.root}>
            <span>
                <h1>{title}</h1>
                <h2>なにかの処理が成功したという仮ぺージ。</h2>
                <li>
                    <a href="./account">ログインぺージ</a>
                </li>
                <li>
                    <a href="./home">ホーム</a>
                </li>
                <button onClick={logout}>ログアウト</button>
                <SessionInfo />
            </span>
            <span></span>
        </div>
    );
}

export { Temp };
