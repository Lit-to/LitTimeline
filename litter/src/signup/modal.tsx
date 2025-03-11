// import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import styles from "./modal.module.css";

export const Signup = () => {
    const [isLogin, setIsLogin] = useState(true);
    const name: string = "Tlitter";
    const title: string = isLogin ? "アカウントを作る" : "ログイン";
    const p_id: string = "ID : ";
    const p_password: string = "パスワード : ";
    const excuse: string = isLogin ? "パスワード大公開宣言" : "パスワードを忘れた";
    const link: string = isLogin ? "https://www.soumu.go.jp/main_sosiki/cybersecurity/kokumin/security/business/staff/06/" : "https://www.soumu.go.jp/main_sosiki/cybersecurity/kokumin/security/business/staff/06/";
    const enter_button: string = isLogin ? "SignUp" : "Login";
    const change_button: string = isLogin ? "ログインする" : "アカウントを作る";

    const handleLogin = () => {
        setIsLogin(!isLogin)
    }


    return (
        <div className={styles.root}>
            <div className={styles.vertical}>
                <h1>{name}</h1>
                <h2>{title}</h2>
                <form>
                    <div className={styles.input_area}>
                        <label>
                            {p_id}
                        </label>
                        <label>
                            <input type="text" name="ID" />
                        </label>
                        <label>
                            {p_password}</label>
                        <label>
                            <input type="password" name="password" />
                        </label>
                    </div>
                    <label>
                        <a href={link} target='about:blank'>
                            {excuse}
                        </a>
                        </label>

                    <div className={styles.horizontal}>
                        <button type="button" >{enter_button}</button>
                        <button type="button" onClick={handleLogin}> {change_button} </button>
                    </div>
                </form>
            </div>


        </div>

    );
}

