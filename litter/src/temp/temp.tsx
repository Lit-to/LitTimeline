import * as reactRouterDom from "react-router-dom";
import styles from "../homepage/app.module.css";
import * as react from "react";
import * as endPoint from "../endPoint.ts";

async function getUserId(): Promise<string> {
    const response = await endPoint.getEndPoint("getUserIdFromSession");
    if (response.result.isSuccess) {
        return response.result.data.userId;
    } else {
        return "";
    }
}
async function getUserName(userId: string): Promise<string> {
    const response = await endPoint.postEndPoint("getName", {
        id: userId,
    });
    if (response.result.isSuccess) {
        return response.result.data.name;
    } else {
        return "";
    }
}
function SessionInfo(): react.JSX.Element {
    const [userId, setUserId] = react.useState<string | null>(null);
    const [userName, setUserName] = react.useState<string | null>(null);
    react.useEffect(() => {
        getUserId().then((id) => setUserId(id));
    }, []);
    react.useEffect(() => {
        if (userId != null) {
            console.log(userId);
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

async function logout(
    navigate: ReturnType<typeof reactRouterDom.useNavigate>
): Promise<void> {
    await endPoint.postEndPoint("logout", {});
    navigate("/");
}

function Temp() {
    const navigate = reactRouterDom.useNavigate();
    const title: string = "Tlitter";
    return (
        <div className={styles.root}>
            <span>
                <h1>{title}</h1>
                <h2>なにかの処理が成功したという仮ぺージ。</h2>
                <li>
                    <a href="./account">アカウントを作る</a>
                </li>
                <li>
                    <a href="/">ホーム？</a>
                </li>
                <button onClick={() => logout(navigate)}>ログアウト</button>
                <SessionInfo />
            </span>
            <span></span>
        </div>
    );
}

export { Temp };
