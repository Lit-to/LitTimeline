import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import styles from "./modal.module.css";

export const Signup = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isExhibited, setShow] = useState(true);

    const title: string = isLogin ? "アカウントを作る" : "ログイン";
    const p_id: string = "ID : ";
    const p_password: string = "パスワード : ";
    const excuse: string = isLogin ? "※パスワードはがんばれば全世界からばれるかも！" : "パスワードを忘れた";
    const link: string = isLogin ? "https://www.soumu.go.jp/main_sosiki/cybersecurity/kokumin/security/business/staff/06/" : "https://www.soumu.go.jp/main_sosiki/cybersecurity/kokumin/security/business/staff/06/";
    const enter_button: string = isLogin ? "SignUp" : "Login";
    const change_button: string = isLogin ? "ログインする" : "アカウントを作る";

    const handleLogin = () => {
        setIsLogin(!isLogin);
    }


    return (
        <div className={styles.root}>
            <span>
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <label>
                                {p_id}
                                <input type="text" name="ID" />
                            </label>
                            <label>
                                {p_password}
                                <input type="password" name="password" />
                            </label>
                            <a href={link} target='about:blank'>
                                {excuse}
                            </a>
                            <div className='button'>
                                <button >{enter_button}</button>
                                <button onClick={handleLogin}> {change_button} </button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal.Dialog>
            </span>

        </div>

    );
}

