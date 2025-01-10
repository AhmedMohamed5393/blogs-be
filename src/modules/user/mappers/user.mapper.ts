import { CreateUserDto } from "../models/dtos/create-user.dto";

export class UserMapper {
    constructor() {}

    public getCreateUserMapper(payload: CreateUserDto) {
        const user: any = {};
        user.name = payload.name;
        user.email = payload.email;
        user.password = payload.password;

        return user;
    }
}
