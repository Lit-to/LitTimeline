import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";
import styles from "./timeline.module.css";
import { useState } from "react";
import { getEndPoint } from "../endPoint";

type PostCardProperties = {
    title: string;
};

function PostCard({ title }: PostCardProperties) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
            </Card.Body>
        </Card>
    );
}

function Home() {
    return (
        <div>
            <SideBar></SideBar>
            <Frame>
                <PostCard title="post 1"></PostCard>
                <PostCard title="post 2"></PostCard>
                <PostCard title="post 2"></PostCard>
                <PostCard title="post 2"></PostCard>
                <PostCard title="post 2"></PostCard>
            </Frame>
        </div>
    );
}

async function logout() {
    await getEndPoint("logout");
}

function SideBar() {
    const [isOpen, setIsOpen] = useState(true);
    function openSideBar() {
        setIsOpen(!isOpen);
    }

    let sidebarOpenClose;
    if (isOpen) {
        sidebarOpenClose = styles.sidebarOpen;
    } else {
        sidebarOpenClose = styles.sidebarClose;
    }

    return (
        <div
            className={`${styles.sidebarPos} ${sidebarOpenClose} ${styles.sidebarStyle}`}
        >
            <div className={styles.sidebarHeader} onClick={openSideBar}>
                ≡
            </div>
            <ul>
                <li className={styles.line}></li>
                <li className={styles.line}>
                    <button className={styles.tab}>ホーム</button>
                </li>
                <li className={styles.line}>
                    <button className={styles.tab}>プロフィール</button>
                </li>
                <li className={styles.line}>
                    <button className={styles.tab} onClick={logout}>
                        ログアウト
                    </button>
                </li>
            </ul>
        </div>
    );
}
function Frame({ children }: { children?: React.ReactNode }) {
    return (
        <div className={styles.vertical}>
            <div className={styles.card}>
                <div className={styles.frameHeader}>Tlitter</div>
                <div className={styles.frameHeader}>ホーム</div>
                <div>{children}</div>
            </div>
        </div>
    );
}

export { Home };
