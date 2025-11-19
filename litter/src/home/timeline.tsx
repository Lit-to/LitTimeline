import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./timeline.module.css";
import { JSX, useEffect, useRef, useState } from "react";
import * as endPoint from "../endPoint.ts";
import * as reactRouterDom from "react-router-dom";
import * as common from "../info/common.ts";
import * as post from "./post.tsx";
const POST_COUNT = Number(import.meta.env.VITE_POST_COUNT);
const MAX_CHAR = 280;

/**
 * 一番下のポストを表示する番兵の型定義
 */
type CardFooterProps = {
    footerRef: React.RefObject<HTMLDivElement | null>;
};

/**
 * 一番下のポストを表示する関数
 *
 * @returns {*} - 一番下のポストを表示するコンポーネント
 */
function CardFooter({ footerRef }: CardFooterProps): JSX.Element {
    return (
        <div style={{ backgroundColor: "lightgray" }}>
            <div ref={footerRef}>一番下のポストです</div>
        </div>
    );
}

// /**
//  * 1ポストを取得する関数
//  * ※今後別ファイルに移動する可能性有、今回は簡易的に作成
//  *
//  * @param {number} id - ポスト
// ID
//  * @returns {*} - 1ポストを表示するコンポーネント
//  */
// function getPosts(id: number): JSX.Element {
//     post.loadPosts();
//     return <post.PostCard title={`post ${id}`} name={`user ${id}`} content={`content ${id}`}></post.PostCard>;
// }

/**
 * タイムラインフレームを表示する関数
 *
 * @param {{ children?: React.ReactNode }} param0
 * @param {React.ReactNode} param0.children - フレーム内に表示する子要素
 * @returns {JSX.Element}
 */
function Frame({ children }: { children?: React.ReactNode }): JSX.Element {
    return (
        <div className={styles.vertical}>
            <div className={styles.card}>
                <div className={styles.frameHeader}>Tlitter</div>
                <div>
                    <PostSpace />
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}

// 監視する領域（ブラウザの表示領域）
/**
 * ホーム画面を表示する関数
 * サイドバー、ポストフレーム、ポスト一覧を含む
 * @type {*} - ホーム画面を表示するコンポーネント
 */
function Home() {
    const [, setLastPostId] = useState(0); // 最後に表示したポストのID
    const [items, setItems] = useState<React.ReactNode[]>([]); // 表示するポストのリスト
    const [isTriggered, setIsTriggered] = useState(false); // ポスト追加がトリガーされたかどうか
    let footerRef = useRef<HTMLDivElement | null>(null); // 一番下のポストを表示するための参照
    const options = {
        root: null,
    };
    const observerObject = new IntersectionObserver(observeFook, options); // 画面位置監視オブジェクト

    useEffect(() => {
        createFook(footerRef);
        return () => observerObject.disconnect();
    }, []);

    /**
     * 監視用フック発行関数
     * 常にこの関数は実行され、footerRefの位置を監視する
     * @param {React.RefObject<HTMLDivElement | null>} footerRef - 一番下のポストの参照
     */
    function createFook(footerRef: React.RefObject<HTMLDivElement | null>): void {
        if (footerRef.current != null) {
            observerObject.observe(footerRef.current);
        }
    }

    /**
     * 監視用フック
     * footerRefのうち画面内にどの要素が入っているかを管理する
     * @param {IntersectionObserverEntry[]} entries - footerRefの一覧
     * @param {IntersectionObserver} observer - 監視オブジェクト
     */
    function observeFook(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void {
        //複数個が想定されているため0番目を指定している
        if (entries[0].isIntersecting) {
            addPosts();
            // observer.unobserve(entries[0].target);
        }
    }

    /**
     * ポスト追加関数
     * APIをたたき、ポストを追加する
     * ※今後別ファイルに移動する可能性有、今回は簡易的に作成
     */
    function addPosts(): void {
        setLastPostId((prev) => {
            if (isTriggered) {
                return prev;
            }
            setIsTriggered(true);
            post.loadPosts().then((newPosts) => {
                for (let i = 0; i < newPosts.length; i++) {
                    addItem(<post.PostCard id={newPosts[i].id} name={newPosts[i].name} content={newPosts[i].content}></post.PostCard>);
                }
                return newPosts[newPosts.length - 1].id;
            });
            setIsTriggered(false);
            return prev;
        });
    }

    /**
     * 配列に要素を追加する関数
     *
     * @param {React.ReactNode} item - 追加する要素
     */
    function addItem(item: React.ReactNode): void {
        setItems((prev) => [...prev, item]);
    }

    return (
        <div className={`${styles.horizontal}`}>
            <SideBar></SideBar>
            <div className={styles.enableScroll}>
                <Frame>
                    {items.map((item, index) => (
                        <div key={index}>{item}</div>
                    ))}
                    <CardFooter footerRef={footerRef} />
                </Frame>
            </div>
        </div>
    );
}

/**
 * ログアウトする関数
 * APIをたたきセッションを削除する。
 * @async
 * @param {reactRouterDom.NavigateFunction} navigate - 画面遷移関数
 */
async function logout(navigate: reactRouterDom.NavigateFunction): Promise<void> {
    await endPoint.logout(navigate);
}

/**
 * サイドバー(ホームやログアウトのボタン)を置く関数
 *
 * @type {*} - サイドバーコンポーネント
 */
function SideBar() {
    const navigate = reactRouterDom.useNavigate();
    const [userName, setUserName] = useState<string | null>(null);
    useEffect(() => {
        common.getUserName().then((name) => setUserName(name));
    }, []);
    return (
        <div className={`${styles.sidebarPos} ${styles.sidebarStyle}`}>
            <div className={styles.sidebarHeader}>{userName}O</div>
            <ul>
                <li className={styles.line}></li>
                <li className={styles.line}>
                    <button className={styles.tabButton}>ホーム</button>
                </li>
                <li className={styles.line}>
                    <button className={styles.tabButton}>プロフィール</button>
                </li>
                <li className={styles.line}>
                    <button className={styles.tabButton} onClick={() => logout(navigate)}>
                        ログアウト
                    </button>
                </li>
            </ul>
        </div>
    );
}

function PostSpace(): JSX.Element {
    const [charCount, setCharCount] = useState(0);
    const [postContent, setPostContent] = useState("");
    const [reloadHook, setReloadHook] = useState(false);
    const [isEnableButton, setIsEnableButton] = useState(false);
    useEffect(() => {
        setPostContent("");
        setCharCount(0);
    }, [reloadHook]);
    return (
        <div>
            <form className={styles.postSpace}>
                <textarea
                    className={styles.postInput}
                    name="postContent"
                    id="postContent"
                    placeholder="内容"
                    value={postContent}
                    onChange={(e) => {
                        setPostContent(e.target.value);
                        updateCharCount(e.target.value.length);
                    }}
                ></textarea>
                <div className={styles.postFooter}>
                    <button className={styles.postButton} type="button" onClick={submitPost} disabled={!isEnableButton}>
                        ぽすと
                    </button>
                    {charCount}/{MAX_CHAR}
                </div>
            </form>
        </div>
    );

    function updateCharCount(contentLength: number): void {
        setCharCount(contentLength);
        setIsEnableButton(0 < contentLength && contentLength <= MAX_CHAR);
    }
    async function submitPost(): Promise<void> {
        await endPoint.createPost(postContent);
        setReloadHook((prev) => !prev);
    }
}

export { Home };
