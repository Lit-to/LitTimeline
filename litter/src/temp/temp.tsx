import { useNavigate } from "react-router-dom";
import styles from "../homepage/app.module.css";
import { useEffect, useState } from 'react';
type SessionData = {
    id: string;
    name: string;
} | null;

const SessionInfo = ({ sessionData }: { sessionData: SessionData }) => {

    if (sessionData == null || !sessionData) {
        return <p>セッション情報なし</p>;
    }
    return (
        <div>
            <h3>セッション情報</h3>
            <p>ID: {sessionData.id}</p>
            <p>名前: {sessionData.name}</p>
        </div>
    );
};

export const Temp = () => {
    const navigate = useNavigate();
    const title: string = "Tlitter";
    const [sessionData, setSessionData] = useState<SessionData>(null);
    function logout() {
        fetch('http://localhost:3000/logout', {
            method: "POST", credentials: 'include', headers: {
                'Pragma': 'no-cache',
                'If-Modified-Since': '0'
            }
        }).then((e)=>{
            navigate("/");
        }).catch((error) => {
            console.error('Error:', error);
        });

    }
    useEffect(() => {
        fetch('http://localhost:3000/get_session_data', {
            method: "GET", credentials: 'include', headers: {
                'Pragma': 'no-cache',
                'If-Modified-Since': '0'
            }
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setSessionData(data.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <div className={styles.root}>
            <span>
                <h1>{title}</h1>
                <h2>なにかの処理が成功したという仮ぺージ。</h2>
                <li><a href="./account">アカウントを作る</a></li>
                <li><a href="/">ホーム？</a></li>
                <button onClick={logout}>ログアウト</button>
                <SessionInfo sessionData={sessionData} />
            </span>
            <span>
            </span>
        </div>
    );
};
