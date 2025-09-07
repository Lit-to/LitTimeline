import * as getPosts from "../database/methods/getPosts";

class Posts{

    id: number;
    user_id: string;
    favorites: number;
    parent_post_id: number;
    is_deleted: boolean;
    is_hidden: boolean;
    created_at: Date;
    updated_at: Date;


    private constructor(id:number, user_id:string, favorites:number, parent_post_id:number, is_deleted:boolean, is_hidden:boolean, created_at:Date, updated_at:Date){
        this.id = id;
        this.user_id = user_id;
        this.favorites = favorites;
        this.parent_post_id = parent_post_id;
        this.is_deleted = is_deleted;
        this.is_hidden = is_hidden;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static async createPostFromCount(firstId:number,count:number): Promise<Posts[]>{
        const postsArray: Posts[] = [];
        for (let i = 0; i < count; i++) {
            await getPosts.getPostContents(firstId, count);
        }
        return postsArray;
    }
}