import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";
import styles from "./timeline.module.css";
import { useState } from "react";
import * as endPoint from "../endPoint.ts";
import * as reactRouterDom from "react-router-dom";

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
        <div className={`${styles.horizontal}`}>
            <SideBar></SideBar>
            <div className={`${styles.enableScroll}`}>
                <Frame>
                    <PostCard title="post 0"></PostCard>
                    <PostCard title="post 1"></PostCard>
                    <PostCard title="post 2"></PostCard>
                    <PostCard title="post 3"></PostCard>
                    <PostCard title="post 4"></PostCard>
                    <PostCard title="post 5"></PostCard>
                    <PostCard title="post 6"></PostCard>
                    <PostCard title="post 7"></PostCard>
                    <PostCard title="post 8"></PostCard>
                    <PostCard title="post 9"></PostCard>
                    <PostCard title="post 10"></PostCard>
                    <PostCard title="post 11"></PostCard>
                    <PostCard title="post 12"></PostCard>
                    <PostCard title="post 13"></PostCard>
                    <PostCard title="post 14"></PostCard>
                    <PostCard title="post 15"></PostCard>
                    <PostCard title="post 16"></PostCard>
                    <PostCard title="post 17"></PostCard>
                    <PostCard title="post 18"></PostCard>
                    <PostCard title="post 19"></PostCard>
                    <PostCard title="post 20"></PostCard>
                    <PostCard title="post 21"></PostCard>
                    <PostCard title="post 22"></PostCard>
                    <PostCard title="post 23"></PostCard>
                    <PostCard title="post 24"></PostCard>
                    <PostCard title="post 25"></PostCard>
                </Frame>
            </div>
        </div>
    );
}

function SideBar() {
    const [isOpen, setIsOpen] = useState(true);
    function openSideBar() {
        setIsOpen(!isOpen);
    }

    const navigate = reactRouterDom.useNavigate();

    async function logout() {
        await endPoint.logout(navigate);
    }

    return (
        <div className={`${styles.sidebarPos} ${styles.sidebarStyle}`}>
            <div className={styles.sidebarHeader} onClick={openSideBar}>
                O
            </div>
            <ul>
                <li className={styles.line}></li>
                <li className={styles.line}>
                    <button className={styles.tabButton}>ホーム</button>
                </li>
                <li className={styles.line}>
                    <button className={styles.tabButton}>プロフィール</button>
                </li>
                <li className={styles.line}>
                    <button className={styles.tabButton} onClick={logout}>
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
                <div>{children}</div>
            </div>
        </div>
    );
}

export { Home };
