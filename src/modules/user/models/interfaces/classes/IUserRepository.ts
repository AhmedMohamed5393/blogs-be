import { ICreateUserRequest } from "../requests/ICreateUserRequest";

export interface IUserRepository {
    getUserBy(where: any, select?: any): Promise<any>;

    createUser(payload: ICreateUserRequest): Promise<any>;
}
