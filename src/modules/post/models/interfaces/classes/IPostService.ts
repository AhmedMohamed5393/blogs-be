import { PageOptionsDto } from "../../../../../shared/pagination/pageOption.dto";
import { CreateDto } from "../../dtos/create.dto";
import { IUpdatePostRequest } from "../requests/IUpdatePostRequest";

export interface IPostService {
    createPost(createDto: CreateDto): Promise<any>;

    getPaginatedList(userId: number, pageOptionsDto: PageOptionsDto): Promise<any>;

    getOneById(id: number): Promise<any>;
        
    checkExistence(id: number): Promise<any>;

    updatePost(id: number, data: IUpdatePostRequest): Promise<any>;
    
    deletePost(id: number): Promise<any>;
}
