export interface ILikeRepository {
    create(itemId: number, type: string, userId: number): Promise<any>;
    
    findFirst(itemId: number, type: string, userId: number): Promise<any>;

    update(id: number, is_liked: boolean): Promise<any>;
}
