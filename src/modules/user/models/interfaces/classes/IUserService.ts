import { CreateUserDto } from "../../dtos/create-user.dto";
import { IUserCheck } from "../requests/IUserCheck";

export interface IUserService {
    checkExistance(info: IUserCheck): Promise<any>;

    getUserBy(where: any, select?: any): Promise<any>;

    createUser(payload: CreateUserDto): Promise<any>;
}
