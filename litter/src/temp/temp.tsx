import styles from "../homepage/app.module.css";

export const Temp = () => {
    const title: string = "Tlitter";

    return (
        <div className={styles.root}>
            <span>
                <h1>{title}</h1>
                <h2>なにかの処理が成功したという仮ぺージ。</h2>
                <li><a href="./account">アカウントを作る</a></li>
                <li><a href="/">ホーム？</a></li>
            </span>
        </div>
    );
}

import 'bootstrap/dist/css/bootstrap.min.css';
