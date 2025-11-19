type RowDataPacket = import("mysql2").RowDataPacket;

class Posts {
    id: number;
    user_id: string;
    contents: string;
    favorites: number;
    parent_post_id: number;
    is_deleted: boolean;
    is_hidden: boolean;
    created_at: Date;
    updated_at: Date;

    /**
     * Creates an instance of Posts.
     *
     * @constructor
     * @public
     * @param {number} id - ポストID
     * @param {string} user_id - ユーザID
     * @param {number} favorites - いいね数
     * @param {number} parent_post_id - 親ポストID
     * @param {boolean} is_deleted - 削除フラグ
     * @param {boolean} is_hidden - 非表示フラグ
     * @param {Date} created_at - 作成日時
     * @param {Date} updated_at - 更新日時
     */
    public constructor(
        id: number,
        user_id: string,
        contents: string,
        favorites: number,
        parent_post_id: number,
        is_deleted: boolean,
        is_hidden: boolean,
        created_at: Date,
        updated_at: Date
    ) {
        this.id = id;
        this.user_id = user_id;
        this.contents = contents;
        this.favorites = favorites;
        this.parent_post_id = parent_post_id;
        this.is_deleted = is_deleted;
        this.is_hidden = is_hidden;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    /**
     * 複数個のポストの初期化
     * ※DBからまとめて初期化する用
     * @public
     * @static
     * @param {RowDataPacket[]} data - ポストデータの配列
     * @returns {Posts[]} - ポストの配列
     */
    public static initFromArray(data: RowDataPacket[]): Posts[] {
        const postsArray: Posts[] = [];
        data.forEach((row) => {
            const post = new Posts(
                row.id,
                row.user_id,
                row.contents,
                row.favorites,
                row.parent_post_id,
                row.is_deleted,
                row.is_hidden,
                row.created_at,
                row.updated_at
            );
            postsArray.push(post);
        });
        return postsArray;
    }
    /**
     * 空のポストを初期化する
     *
     * @public
     * @static
     * @returns {Posts} - 空のポスト
     */
    public static initEmptyPost(): Posts {
        return new Posts(0, "", "", 0, 0, false, false, new Date(), new Date());
    }

    /**
     * idのgetter
     *
     * @returns {number}
     */
    private get getId(): number {
        return this.id;
    }
    /**
     * idのsetter

    * @param {number} id - ポストID
     */
    private set setId(id: number) {
        this.id = id;
    }

    /**
     * user_idのgetter
     *
     * @returns {string}
     */
    private get getUserId(): string {
        return this.user_id;
    }
    /**
     * user_idのsetter
     *
     * @param {string} userId - ユーザID
     */
    private set setUserId(userId: string) {
        this.user_id = userId;
    }

    /**
     * favoritesのgetter
     *
     * @returns {number}
     */
    private get getFavorites(): number {
        return this.favorites;
    }
    /**
     * favoritesのsetter
     *
     * @param {number} favorites - いいね数
     */
    private set setFavorites(favorites: number) {
        this.favorites = favorites;
    }

    /**
     * parent_post_idのgetter
     *
     * @returns {number}
     */
    private get getParentPostId(): number {
        return this.parent_post_id;
    }
    /**
     * parent_post_idのsetter
     *
     * @param {number} parentPostId - 親ポストID
     */
    private set setParentPostId(parentPostId: number) {
        this.parent_post_id = parentPostId;
    }

    /**
     * is_deletedのgetter
     *
     * @returns {boolean}
     */
    private get getIsDeleted(): boolean {
        return this.is_deleted;
    }
    /**
     * is_deletedのsetter
     *
     * @param {boolean} isDeleted - 削除フラグ
     */
    private set setIsDeleted(isDeleted: boolean) {
        this.is_deleted = isDeleted;
    }

    /**
     * is_hiddenのgetter
     *
     * @returns {boolean}
     */
    private get getIsHidden(): boolean {
        return this.is_hidden;
    }
    /**
     * is_hiddenのsetter
     *
     * @param {boolean} isHidden - 非表示フラグ
     */
    private set setIsHidden(isHidden: boolean) {
        this.is_hidden = isHidden;
    }

    /**
     * created_atのgetter
     *
     * @returns {Date}
     */
    private get getCreatedAt(): Date {
        return this.created_at;
    }
    /**
     * created_atのsetter
     *
     * @param {Date} createdAt - 作成日時
     */
    private set setCreatedAt(createdAt: Date) {
        this.created_at = createdAt;
    }

    /**
     * updated_atのgetter
     *
     * @returns {Date}
     */
    private get getUpdatedAt(): Date {
        return this.updated_at;
    }
    /**
     * updated_atのsetter
     *
     * @param {Date} updatedAt - 更新日時
     */
    private set setUpdatedAt(updatedAt: Date) {
        this.updated_at = updatedAt;
    }
    public static async initPosts(id: number): Promise<Posts> {
        return Posts.constructor();
    }
}
export { Posts };
