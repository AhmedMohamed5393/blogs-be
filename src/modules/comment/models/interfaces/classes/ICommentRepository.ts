import { PageOptionsDto } from "../../../../../shared/pagination/pageOption.dto";
import { ICreateCommentRequest } from "../requests/ICreateCommentRequest";
import { IUpdateCommentRequest } from "../requests/IUpdateCommentRequest";

export interface ICommentRepository {
    create(data: ICreateCommentRequest): Promise<any>;
    
    count(userId: number): Promise<any>;

    findMany(userId: number, pageOptionsDto: PageOptionsDto, postId?: number): Promise<any>;

    findUnique(id: number): Promise<any>;

    is_exists(id: number, userId: number, postId?: number): Promise<any>;

    update(id: number, data: IUpdateCommentRequest): Promise<any>;

    soft_delete(id: number): Promise<any>;
}
