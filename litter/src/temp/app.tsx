import { Link } from "react-router-dom";
import styles from "./app.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const App = () => {
    const title: string = "Tlitter";

    return (
        <div className={styles.root}>
            <span>
                <h1>{title}</h1>
                <h2>今のところただのテストぺージ。とりあえず作ったページをならべるよ</h2>
                <li>
                    <Link to="/login">アカウントを作る</Link>
                </li>
                <li>
                    <Link to="/home">ホーム</Link>
                </li>
            </span>
        </div>
    );
};
