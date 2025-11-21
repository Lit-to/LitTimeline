import { JSX } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./post.module.css";
import * as endPoint from "../endPoint.ts";
const POSTCOUNT = 20;
/**
 * 1ポストに必要なプロパティを表す型
 * ※今後別ファイルに移動する可能性有、今回は簡易的に作成
 *
 * @typedef {PostCardProperties}
 */
type PostCardProperties = {
    postId: number;
    userId: string;
    name: string;
    content: string;
};
/**
 * 1ポストを表示するコンポーネント
 * ※今後別ファイルに移動する可能性有、今回は簡易的に作成
 * @param {PostCardProperties} postProperties
 * @returns {*}
 */
function PostCard(postProperties: PostCardProperties): JSX.Element {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.headerName}>{postProperties.name}</div>
                <div className={styles.headerUserId}>@{postProperties.userId}</div>
                <div className={styles.headerPostId}>{postProperties.postId}</div>
            </div>
            <hr></hr>
            <div className={styles.contents}>
                <ReactMarkdown>{postProperties.content}</ReactMarkdown>
            </div>
            <hr></hr>
        </div>
    );
}

async function loadPosts(): Promise<PostCardProperties[]> {
    const rows = await endPoint.loadPosts(POSTCOUNT);
    let result = [];
    for (const post of rows.result.data) {
        const name = await endPoint.getName(post.user_id);
        const content = post.contents;
        result.push({ postId: post.id, userId: post.user_id, name: name, content: content });
    }
    return result;
}

export { PostCard, loadPosts };
