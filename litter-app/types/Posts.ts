type RowDataPacket = import("mysql2").RowDataPacket;

class Posts {
    id: number;
    user_id: string;
    favorites: number;
    parent_post_id: number;
    is_deleted: boolean;
    is_hidden: boolean;
    created_at: Date;
    updated_at: Date;

    public constructor(
        id: number,
        user_id: string,
        favorites: number,
        parent_post_id: number,
        is_deleted: boolean,
        is_hidden: boolean,
        created_at: Date,
        updated_at: Date
    ) {
        this.id = id;
        this.user_id = user_id;
        this.favorites = favorites;
        this.parent_post_id = parent_post_id;
        this.is_deleted = is_deleted;
        this.is_hidden = is_hidden;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
    public static initFromArray(data: RowDataPacket[]): Posts[] {
        const postsArray: Posts[] = [];
        data.forEach((row) => {
            const post = new Posts(
                row.id,
                row.user_id,
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
    public static initEmptyPost(): Posts {
        return new Posts(0, "", 0, 0, false, false, new Date(), new Date());
    }

    private get getId(): number {
        return this.id;
    }
    private set setId(id: number) {
        this.id = id;
    }

    private get getUserId(): string {
        return this.user_id;
    }
    private set setUserId(userId: string) {
        this.user_id = userId;
    }

    private get getFavorites(): number {
        return this.favorites;
    }
    private set setFavorites(favorites: number) {
        this.favorites = favorites;
    }

    private get getParentPostId(): number {
        return this.parent_post_id;
    }
    private set setParentPostId(parentPostId: number) {
        this.parent_post_id = parentPostId;
    }

    private get getIsDeleted(): boolean {
        return this.is_deleted;
    }
    private set setIsDeleted(isDeleted: boolean) {
        this.is_deleted = isDeleted;
    }

    private get getIsHidden(): boolean {
        return this.is_hidden;
    }
    private set setIsHidden(isHidden: boolean) {
        this.is_hidden = isHidden;
    }

    private get getCreatedAt(): Date {
        return this.created_at;
    }
    private set setCreatedAt(createdAt: Date) {
        this.created_at = createdAt;
    }

    private get getUpdatedAt(): Date {
        return this.updated_at;
    }
    private set setUpdatedAt(updatedAt: Date) {
        this.updated_at = updatedAt;
    }
    public static async initPosts(id: number): Promise<Posts> {
        return Posts.constructor();
    }
}
export { Posts };
