
import { useState } from 'react';
import styles from "./modal.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ThemeToggle from '../component/themeToggle';

const API_IP = import.meta.env.VITE_API_IP;
const API_PORT = import.meta.env.VITE_API_PORT;




export const Signup = () => {
    const [isSignup, setIsSignup] = useState(true); //右の関数で値を変更する Trueならサインアップ、falseならログイン
    const name: string = "Tlitter";
    const title: string = isSignup ? "アカウントを作る" : "ログイン";
    const [reason, setReason] = useState<string>("");
    const p_id: string = "ID : ";
    const p_name: string = "名前 : ";
    const p_password: string = "パスワード : ";
    const excuse: string = isSignup ? "パスワード大公開宣言" : "パスワードを忘れた";
    const link: string = isSignup ? "https://www.soumu.go.jp/main_sosiki/cybersecurity/kokumin/security/business/staff/06/" : "https://www.soumu.go.jp/main_sosiki/cybersecurity/kokumin/security/business/staff/06/";
    const buttonName: string = isSignup ? "SignUp" : "Login";
    const labelChangeLogin: string = "ログイン";
    const labelChangeSignup: string = "アカウント作成";
    const no_response: string = "サーバーが応答しません";
    const navigate = useNavigate();

    function handleScreenStatus(status: boolean) {
        // trueならサインアップ、falseならログインとして受け取り、
        // 渡されたとおりに画面を切り替える
        setIsSignup(status)
    }
    function handleTabScreen(tabId: string | null) {
        // タブの切り替えを行う
        // タブのIDを受け取り、サインアップかログインかを判断する
        // タブのIDはsignupかloginのどちらか
        if (tabId === "login") {
            handleScreenStatus(false);
        } else {
            handleScreenStatus(true);
        }
    }

    function handleTheme(isDark: boolean) {
        // テーマの切り替えを行う
        // isDarkがtrueならダークモード、falseならライトモード
        if (isDark) {
            document.documentElement.setAttribute("theme", "dark");
        }
        else {
            document.documentElement.setAttribute("theme", "light");
        }
    };

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

    function nameForm(enable: boolean) {
        // 名前フォーム
        // アカウント作成時のみ表示する。引数は表示するかしないか
        if (enable) {
            return (<Form.Group>
                <Form.Label>
                    {p_name}</Form.Label>
                <Form.Control type="text" name="name" required={true} />
            </Form.Group>)
        }
        else {
            return (<></>)
        }
    }

    function idForm() {
        return (<Form.Group>
            <Form.Label>
                {p_id}
            </Form.Label>
            <Form.Control type="text" name="ID" pattern="^[A-Za-z0-9_ ]+-?$" required={true} />
        </Form.Group>)
    }
    function passwordForm() {
        return (<Form.Group>
            <Form.Label>
                {p_password}</Form.Label>
            <Form.Control type="password" name="password" pattern="^[A-Za-z0-9_ ]+-?$" required={true} />
        </Form.Group>)
    }
    function buttonSpace() {
        return (<Form.Group className={styles.horizontal}>
            <Button variant='primary' type="submit">{buttonName}</Button>
        </Form.Group>)
    }

    function displayForm(isSignup: boolean) {
        // アカウント作成時のフォームを表示する
        return (
            <Form onSubmit={handleSubmit}>
                <Form.Label className={styles.reason}>{reason}</Form.Label>
                <Form.Group className={styles.input_area}>
                    {nameForm(isSignup)}
                    {idForm()}
                    {passwordForm()}
                <Form.Label>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                        {excuse}
                    </a>
                </Form.Label>
                </Form.Group>
                {buttonSpace()}
            </Form>
        )
    }

    return (
        <div className={styles.root}>
            <div className={styles.vertical}>
                <h1>{name}</h1>
                <h2>{title}</h2>
                <Tabs defaultActiveKey="login" transition={false} onSelect={(tabId) => { handleTabScreen(tabId) }} className={styles.tab}>
                    <Tab eventKey='login' title={labelChangeLogin}>
                        {displayForm(false)}</Tab>
                    <Tab eventKey='signup' title={labelChangeSignup}>
                        {displayForm(true)}</Tab>
                </Tabs>
            </div>
            <div className={styles.themeToggle}>
                <ThemeToggle onToggle={handleTheme} />
            </div>
        </div>
    );
}


