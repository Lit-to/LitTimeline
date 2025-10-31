import { useState, useEffect } from "react";
import styles from "./modal.module.css";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import * as common from "../info/common.ts";

export const Signup = (loginHook: { loginHook: (value: boolean) => void }) => {
    const [isSignup, setIsSignup] = useState(true); //右の関数で値を変更する Trueならサインアップ、falseならログイン
    const name: string = "Tlitter";
    const title: string = isSignup ? "アカウントを作る" : "ログイン";
    const [reason, setReason] = useState<string>("");
    const labelFieldId: string = "ID : ";
    const labelFieldName: string = "名前 : ";
    const labelFieldPassword: string = "パスワード : ";
    const linkExcuse: string = isSignup ? "パスワード大公開宣言" : "パスワードを忘れた";
    const link: string = isSignup
        ? "https://www.soumu.go.jp/main_sosiki/cybersecurity/kokumin/security/business/staff/06/"
        : "https://www.google.com/search?q=%E3%83%91%E3%82%B9%E3%83%AF%E3%83%BC%E3%83%89+%E6%80%9D%E3%81%84%E5%87%BA%E3%81%97%E6%96%B9+-%E3%82%8A%E3%81%A3%E3%81%A8%E3%83%BC%E3%81%ABDM%E3%82%92%E4%B8%8B%E3%81%95%E3%81%84&sca_esv=673d304d98189f99&sxsrf=AE3TifOPxUDCO5mROJ7y0xmwSZcddvlTCQ%3A1748652787681&ei=81I6aNKyKbXc1e8PhYLLaA&ved=0ahUKEwiS-Pqhv8yNAxU1bvUHHQXBEg0Q4dUDCBA&uact=5&oq=%E3%83%91%E3%82%B9%E3%83%AF%E3%83%BC%E3%83%89+%E6%80%9D%E3%81%84%E5%87%BA%E3%81%97%E6%96%B9+-%E3%82%8A%E3%81%A3%E3%81%A8%E3%83%BC%E3%81%ABDM%E3%82%92%E4%B8%8B%E3%81%95%E3%81%84&gs_lp=Egxnd3Mtd2l6LXNlcnAaAhgCIj7jg5Hjgrnjg6_jg7zjg4kg5oCd44GE5Ye644GX5pa5IC3jgorjgaPjgajjg7zjgatETeOCkuS4i-OBleOBhEiDUlCgAVj2TXAEeAGQAQCYAakBoAHcBaoBAzAuNbgBA8gBAPgBAfgBApgCCKAChgWoAhHCAgoQABiwAxjWBBhHwgIEEAAYHsICCBAAGIAEGKIEwgIFEAAY7wXCAgcQIxgnGOoCwgIKECMYJxjqAhiLA8ICFBAAGIAEGOMEGLQCGOkEGOoC2AEBmAMI8QWcLbo0ZB3TqIgGAZAGCroGBggBEAEYAZIHAzQuNKAHvgmyBwMwLjS4B_UEwgcFMC41LjPIBxY&sclient=gws-wiz-serp";
    const buttonName: string = isSignup ? "SignUp" : "Login";
    const tabName = { login: "ログイン", signup: "アカウント作成" };
    const tabCode = { login: "login", signup: "signup" };

    useEffect(() => {
        handleTabScreen(tabCode.login);
        displayForm(false);
    }, []);

    const navigate = useNavigate();

    function handleScreenStatus(toggleToSignup: boolean) {
        // trueならサインアップ、falseならログインとして受け取り、
        // 渡されたとおりに画面を切り替える
        setIsSignup(toggleToSignup);
    }
    function handleTabScreen(tabId: string | null) {
        // タブの切り替えを行う
        // タブのIDを受け取り、サインアップかログインかを判断する
        // タブのIDはsignupかloginのどちらか
        if (tabId === tabCode.login) {
            handleScreenStatus(false);
        } else {
            handleScreenStatus(true);
        }
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const id = formData.get("ID");
        if (typeof id !== "string" || id.length === 0) {
            setReason("idが不正です");
            return;
        }
        const password = formData.get("password");
        if (typeof password !== "string" || password.length === 0) {
            setReason("パスワードが不正です");
            return;
        }
        if (isSignup) {
            const name = formData.get("name");
            if (typeof name !== "string" || name.length === 0) {
                setReason("名前が不正です");
                return;
            }
            common.signUp(id, name, password, setReason).then((result) => {
                loginHook.loginHook(result);
                if (result) {
                    navigate("/temp");
                }
            });
        } else {
            common.login(id, password, setReason).then((result) => {
                loginHook.loginHook(result);
                if (result) {
                    navigate("/temp");
                }
            });
        }
    }

    function nameForm(isShowNameForm: boolean) {
        // 名前フォーム
        // アカウント作成時のみ表示する。引数は表示するかしないか
        if (isShowNameForm) {
            return (
                <Form.Group>
                    <Form.Label>{labelFieldName}</Form.Label>
                    <Form.Control type="text" name="name" required={true} />
                </Form.Group>
            );
        } else {
            return <></>;
        }
    }

    function idForm() {
        return (
            <Form.Group>
                <Form.Label>{labelFieldId}</Form.Label>
                <Form.Control type="text" name="ID" pattern="^[A-Za-z0-9_ ]+-?$" required={true} />
            </Form.Group>
        );
    }
    function passwordForm() {
        return (
            <Form.Group>
                <Form.Label>{labelFieldPassword}</Form.Label>
                <Form.Control type="password" name="password" pattern="^[A-Za-z0-9_ ]+-?$" required={true} />
            </Form.Group>
        );
    }
    function buttonSpace() {
        return (
            <Form.Group className={styles.horizontal}>
                <Button variant="primary" type="submit">
                    {buttonName}
                </Button>
            </Form.Group>
        );
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
                            {linkExcuse}
                        </a>
                    </Form.Label>
                </Form.Group>
                {buttonSpace()}
            </Form>
        );
    }

    return (
        <div className={styles.root}>
            <div className={styles.vertical}>
                <h1>{name}</h1>
                <h2>{title}</h2>
                <Tabs
                    transition={false}
                    onSelect={(tabId) => {
                        handleTabScreen(tabId);
                    }}
                    className={styles.tab}
                >
                    <Tab eventKey={tabCode.login} title={tabName.login}>
                        {displayForm(false)}
                    </Tab>
                    <Tab eventKey={tabCode.signup} title={tabName.signup}>
                        {displayForm(true)}
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
};
