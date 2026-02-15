import * as reactRouterDom from "react-router-dom";
import styles from "./app.module.css";
import * as react from "react";
import * as common from "../info/common.ts";

function SessionInfo(): react.JSX.Element {
    const [userId, setUserId] = react.useState<string | null>(null);
    const [userName, setUserName] = react.useState<string | null>(null);
    react.useEffect(() => {
        common.getUserId().then((id) => setUserId(id));
    }, []);
    react.useEffect(() => {
        if (userId != null) {
            common.getUserName().then((name) => setUserName(name));
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
        await common.logout(navigate);
    }
    const title: string = "Tlitter";
    return (
        <div className={styles.root}>
            <span>
                <h1>{title}</h1>
                <h2>なにかの処理が成功したという仮ぺージ。</h2>
                <li>
                    <reactRouterDom.Link to="./login">ログインぺージ</reactRouterDom.Link>
                </li>
                <li>
                    <reactRouterDom.Link to="./home">ホーム</reactRouterDom.Link>
                </li>
                <button onClick={logout}>ログアウト</button>
                <SessionInfo />
            </span>
            <span></span>
        </div>
    );
}

export { Temp };
