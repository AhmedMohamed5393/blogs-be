export interface ILikeService {
    createLikeToItemByType(itemId: number, type: string, userId: number): Promise<any>;
    
    checkExistenceOfLike(itemId: number, type: string, userId: number): Promise<any>;

    assignLikeToItemById(id: number, is_liked: boolean): Promise<any>;

    checkExistenceOfPostItem(id: number): Promise<any>;

    checkExistenceOfCommentItem(id: number): Promise<any>;
}
