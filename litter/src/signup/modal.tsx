
import { useState } from 'react';
import styles from "./modal.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_IP = import.meta.env.VITE_API_IP;
const API_PORT = import.meta.env.VITE_API_PORT;

export const Signup = () => {
    const [isSignup, setIsLogin] = useState(true); //右の関数で
    const name: string = "Tlitter";
    const title: string = isSignup ? "アカウントを作る" : "ログイン";
    const [reason, setReason] = useState<string>("");
    const p_id: string = "ID : ";
    const p_name: string = "名前 : ";
    const p_password: string = "パスワード : ";
    const excuse: string = isSignup ? "パスワード大公開宣言" : "パスワードを忘れた";
    const link: string = isSignup ? "https://www.soumu.go.jp/main_sosiki/cybersecurity/kokumin/security/business/staff/06/" : "https://www.soumu.go.jp/main_sosiki/cybersecurity/kokumin/security/business/staff/06/";
    const enter_button: string = isSignup ? "SignUp" : "Login";
    const change_button: string = isSignup ? "ログインする" : "アカウントを作る";
    const no_response: string = "サーバーが応答しません";
    const navigate = useNavigate();

    const handleLogin = () => {
        setIsLogin(!isSignup)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const id = formData.get('ID');
        const password = formData.get('password');
        const name = formData.get('name');
        if (isSignup) {
            // アカウント作成用のクエリを投げる
            axios.post("http://" + API_IP + ":" + API_PORT + "/register", { "id": id, "name": name, "password": password }).then((response) => {
                if (response.status === 200) {
                    //処理に成功した場合は一時ぺージに飛ばす ログイン後ぺージに遷移予定
                    setReason("");
                    navigate("/temp");

                }
            }).catch((error) => {
                if (error.response) {
                    // エラーを受け取ったときはエラー内容をそのまま表示
                    setReason(error.response.data.reason);
                }
                else if (error.request) {
                    // リクエストが送信されたが、応答がない場合
                    setReason(no_response);
                }
            });


        } else {
            //将来ログイン処理が入る予定
            //axios.post("http://" + API_IP + ":" + API_PORT + "/login", { "id": id, "password": password })
        }
    }

    return (
        <div className={styles.root}>
            <div className={styles.vertical}>
                <h1>{name}</h1>
                <h2>{title}</h2>
                <form onSubmit={handleSubmit}>
                    <label className={styles.reason}>{reason}</label>
                    <div className={styles.input_area}>
                        <span className={isSignup ? "" : styles.hidden}>
                            <label >
                                {p_name}
                                {isSignup && (
                                    <input type="text" name="name" required={true} />
                                )}</label>
                        </span>
                        <span>
                            <label>
                                {p_id}
                            </label>
                            <label>
                                <input type="text" name="ID" pattern="^[A-Za-z0-9_ ]+-?$" required={true} />
                            </label>
                        </span>
                        <span>
                            <label>
                                {p_password}</label>
                            <label>
                                <input type="password" name="password" pattern="^[A-Za-z0-9_ ]+-?$" required={true} />
                            </label>
                        </span>
                    </div>
                    <label>
                        <a href={link} target='about:blank'>
                            {excuse}
                        </a>
                    </label>

                    <div className={styles.horizontal}>
                        <button type="submit">{enter_button}</button>
                        <button type="button" onClick={handleLogin}> {change_button} </button>
                    </div>
                </form>
            </div>


        </div>

    );
}

