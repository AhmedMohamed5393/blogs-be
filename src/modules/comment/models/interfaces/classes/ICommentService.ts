import { PageOptionsDto } from "../../../../../shared/pagination/pageOption.dto";
import { CreateDto } from "../../dtos/create.dto";
import { IUpdateCommentRequest } from "../requests/IUpdateCommentRequest";

export interface ICommentService {
    createComment(createDto: CreateDto): Promise<any>;
    
    getPaginatedList(userId: number, pageOptionsDto: PageOptionsDto, postId?: number): Promise<any>;

    getOneById(id: number): Promise<any>;
        
    checkExistence(id: number, userId: number, postId?: number): Promise<any>;

    updateComment(id: number, data: IUpdateCommentRequest): Promise<any>;
    
    deleteComment(id: number): Promise<any>;
}
