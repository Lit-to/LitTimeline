import * as endPoint from "../endPoint.ts";
import * as reactRouterDom from "react-router-dom";

/*=======================
汎用関数を入れるファイル
=========================*/

/**
 * セッションidからユーザーidを取得する
 *
 * @async
 * @returns {Promise<string>} - ユーザーID
 */
async function getUserId(): Promise<string> {
    return await endPoint.getUserIdFromSession();
}

/**
 * ユーザid経由でユーザ名を取得する
 *
 * @async
 * @returns {Promise<string>} - ユーザー名
 */
async function getUserName(): Promise<string> {
    const id = await getUserId();
    return await endPoint.getName(id);
}

/**
 * ログアウトし、ぺージ遷移する。
 *
 * @async
 * @param {ReturnType<typeof reactRouterDom.useNavigate>} navigate - 画面遷移フック
 */
async function logout(navigate: ReturnType<typeof reactRouterDom.useNavigate>): Promise<void> {
    await endPoint.logout(navigate);
}

/**
 * ログイン関数
 * ユーザidとパスワードを認証する
 *
 * @async
 * @param {string} id - ユーザーID
 * @param {string} password - パスワード
 */
async function login(id: string, password: string): Promise<void> {
    await endPoint.login(id, password);
}

/**
 * アカウント作成関数
 *
 * @param {string} id - ユーザーID
 * @param {string} name - ユーザー名
 * @param {string} password - パスワード
 * @param {(reason: string) => void} setReason - エラーメッセージを設定する関数
 * @returns {Promise<string>}
 */
function signUp(id: string, name: string, password: string, setReason: (reason: string) => void): Promise<string> {
    const sessionId = endPoint.signUp(id, name, password, setReason).then((sessionId) => {
        return sessionId;
    });
    return sessionId;
}

export { getUserId, getUserName, logout, login, signUp };
