import * as reactRouterDom from "react-router-dom";
import styles from "../homepage/app.module.css";
import * as react from "react";
import { responseToJson } from "../common/responseFunc.ts";

async function getUserId(): Promise<string> {
    try {
        const response = await fetch(
            "http://localhost:3000/getUserIdFromSession",
            {
                method: "GET",
                credentials: "include",
                headers: {
                    Pragma: "no-cache",
                    "If-Modified-Since": "0",
                },
            }
        );
        const responseJson = await responseToJson(response);
        if (responseJson.result.isSuccess) {
            console.log(
                "User ID fetched successfully:",
                responseJson.result.data.userId
            );
            return responseJson.result.data.userId;
        }
        return "";
    } catch (error) {
        console.error("Error fetching user ID:", error);
        return "";
    }
}
async function getUserName(userId: string): Promise<string> {
    try {
        const response = await fetch("http://localhost:3000/getName", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Pragma: "no-cache",
                "If-Modified-Since": "0",
            },
            body: JSON.stringify({ id: userId }),
        });
        const responseJson = await responseToJson(response);
        if (responseJson.result.isSuccess) {
            return responseJson.result.data.name;
        }
        return "";
    } catch (error) {
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
    try {
        await fetch("http://localhost:3000/logout", {
            method: "POST",
            credentials: "include",
            headers: {
                Pragma: "no-cache",
                "If-Modified-Since": "0",
            },
        });
        navigate("/");
    } catch (error) {
        console.error("Logout failed:", error);
    }
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
