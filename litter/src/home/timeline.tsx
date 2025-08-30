import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";
import styles from "./timeline.module.css";
import { useEffect, useRef, useState } from "react";
import * as endPoint from "../endPoint.ts";
import * as reactRouterDom from "react-router-dom";

type PostCardProperties = {
    title: string;
    name: string;
    content: string;
};

function PostCard({ title, name, content }: PostCardProperties) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Header>{name}</Card.Header>
                <Card.Text>{content}</Card.Text>
            </Card.Body>
        </Card>
    );
}

function CardFooter() {
    return <div style={{ backgroundColor: "lightgray" }}>一番下のツイートです</div>;
}

function getPosts(id: number) {
    return <PostCard title={`post ${id}`} name={`user ${id}`} content={`content ${id}`}></PostCard>;
}
const POST_COUNT = 20;

function Home() {
    // 監視する領域（ブラウザの表示領域）
    const [, setLastPostId] = useState(0);
    const [items, setItems] = useState<React.ReactNode[]>([]);
    let footerRef = useRef<HTMLDivElement | null>(null);
    const options = {
        root: null,
    };
    const observerObject = new IntersectionObserver(observeFook, options);

    useEffect(() => {
        createFook(footerRef);
        return () => observerObject.disconnect();
    }, []);

    function createFook(footerRef: React.RefObject<HTMLDivElement | null>) {
        if (footerRef.current != null) {
            observerObject.observe(footerRef.current);
        }
    }

    function observeFook(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
        if (entries[0].isIntersecting) {
            addCards(POST_COUNT);
        }
        observer.unobserve(entries[0].target);
        observer.observe(entries[0].target);
    }

    function addCards(count: number) {
        setLastPostId((prev) => {
            let start = prev;
            for (let i = start + 1; i <= start + count; ++i) {
                addItem(getPosts(i));
            }
            return start + count;
        });
    }

    function addItem(item: React.ReactNode) {
        setItems((prev) => [...prev, item]);
    }

    return (
        <div className={`${styles.horizontal}`}>
            <SideBar></SideBar>
            <div className={styles.enableScroll}>
                <Frame>
                    {items}
                    <div ref={footerRef}>a</div>
                    <CardFooter />
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
