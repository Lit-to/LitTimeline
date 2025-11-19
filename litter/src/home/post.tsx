import { Card } from "react-bootstrap";
import * as reactMd from "react-markdown";
import { JSX } from "react";
import * as endPoint from "../endPoint.ts";
const POSTCOUNT = 20;
/**
 * 1ポストに必要なプロパティを表す型
 * ※今後別ファイルに移動する可能性有、今回は簡易的に作成
 *
 * @typedef {PostCardProperties}
 */
type PostCardProperties = {
    id: number;
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
        <Card>
            <Card.Body>
                <Card.Header>{postProperties.id}</Card.Header>
                <Card.Header>{postProperties.name}</Card.Header>
                <Card.Text>
                    {/* <reactMd.default>{postProperties.content}</reactMd.default> */}
                    {postProperties.content}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

async function loadPosts(): Promise<PostCardProperties[]> {
    const rows = await endPoint.loadPosts(POSTCOUNT);
    let result = [];
    for (const post of rows.result.data) {
        const name = await endPoint.getName(post.user_id);
        const content = post.contents;
        result.push({ id: post.id, name: name, content: content });
    }
    return result;
}

export { PostCard, loadPosts };
