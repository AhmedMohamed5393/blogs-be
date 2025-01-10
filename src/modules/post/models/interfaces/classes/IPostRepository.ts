import { PageOptionsDto } from "../../../../../shared/pagination/pageOption.dto";
import { ICreatePostRequest } from "../requests/ICreatePostRequest";
import { IUpdatePostRequest } from "../requests/IUpdatePostRequest";

export interface IPostRepository {
    create(data: ICreatePostRequest): Promise<any>;

    count(userId: number): Promise<any>;

    findMany(userId: number, pageOptionsDto: PageOptionsDto): Promise<any>;

    findUnique(id: number): Promise<any>;

    is_exists(id: number): Promise<any>;

    update(id: number, data: IUpdatePostRequest): Promise<any>;

    soft_delete(id: number): Promise<any>;
}
