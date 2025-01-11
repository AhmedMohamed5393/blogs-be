import { PageOptionsDto } from "../../../../../shared/pagination/pageOption.dto";
import { CreateDto } from "../../dtos/create.dto";
import { IUpdatePostRequest } from "../requests/IUpdatePostRequest";

export interface IPostService {
    createPost(createDto: CreateDto): Promise<any>;

    getPaginatedList(pageOptionsDto: PageOptionsDto, userId?: number): Promise<any>;

    getOneById(id: number, userId?: number): Promise<any>;
        
    checkExistence(id: number, userId: number): Promise<any>;

    updatePost(id: number, data: IUpdatePostRequest): Promise<any>;
    
    deletePost(id: number): Promise<any>;
}
