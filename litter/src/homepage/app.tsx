import styles from "./app.module.css";

export const App = () => {
    const title: string = "Litter";

    return (
        <div className={styles.root}>
            <span>
                <h1>{title}</h1>
                <h2>今のところただのテストぺージ。とりあえず作ったページをならべるよ</h2>
                <li><a href="./account">アカウントを作る</a></li>
                <li>ホーム？</li>
            </span>
        </div>
    );
}

import 'bootstrap/dist/css/bootstrap.min.css';
