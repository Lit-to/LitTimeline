import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";
import styles from "./timeline.module.css";

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
        <Frame>
            <PostCard title="post 1"></PostCard>
            <PostCard title="post 2"></PostCard>
            <PostCard title="post 2"></PostCard>
            <PostCard title="post 2"></PostCard>
            <PostCard title="post 2"></PostCard>
        </Frame>
    );
}

function Frame({ children }: { children?: React.ReactNode }) {
    return (
        <div className={styles.horizontal}>
            <div className={styles.vertical}>
                <div className={styles.sidebar}>
                    <h4>=</h4>
                    <ul>
                        <li>ホーム</li>
                        <li>プロフィール</li>
                        <li>ログアウト</li>
                    </ul>
                </div>
            </div>
            <div className={styles.vertical}>
                <div className={styles.frameHeader}>Tlitter</div>
                <div className={styles.frameHeader}>ホーム</div>
                <div>{children}</div>
            </div>
        </div>
    );
}

export { Home };
