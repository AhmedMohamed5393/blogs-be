import { CreateUserDto } from "../models/dtos/create-user.dto";
import { ICreateUserRequest } from "../models/interfaces/requests/ICreateUserRequest";

export class UserMapper {
    constructor() {}

    public getCreateUserMapper(payload: CreateUserDto): ICreateUserRequest {
        const user: ICreateUserRequest = {
            name: payload.name,
            email: payload.email,
            password: payload.password,
        };

        return user;
    }
}
