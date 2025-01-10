import { UserRepository } from "../repositories/userRepository";
import { IUserRepository } from "../models/interfaces/classes/IUserRepository";
import { UserRepositoriesFactory } from "../repositories/userRepositoriesFactory";
import { IUserService } from "../models/interfaces/classes/IUserService";
import { getLogger } from "../../../shared/utils/helpers";
import { IUserCheck } from "../models/interfaces/requests/IUserCheck";
import { UserMapper } from "../mappers/user.mapper";
import { CreateUserDto } from "../models/dtos/create-user.dto";

const TAG = "blogs-be:user:userService";

export class UserService implements IUserService {
    private repository: IUserRepository;
    private repositoriesFactory: UserRepositoriesFactory;
    private userMapper: UserMapper;

    constructor(repository?: IUserRepository) {
        if (!repository) {
            this.repositoriesFactory = UserRepositoriesFactory.Instance;

            this.repository = this.repositoriesFactory.getRepository(UserRepository.name);
        } else {
            this.repository = repository;
        }

        this.userMapper = new UserMapper();
    }

    public async checkExistance(
        info: IUserCheck,
    ): Promise<any> {
        try {
            return await this.repository.getUserBy(
                { OR: [{ name: info.name }, { email: info.email }] },
                { id: true, name: true, email: true, password: true },
            );
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:checkExistance`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async getUserBy(
        where: any,
        select: any,
    ): Promise<any> {
        try {
            return await this.repository.getUserBy(
                where,
                select,
            );
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:getUserBy`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async createUser(request: CreateUserDto): Promise<any> {
        try {
            const userPayload = this.userMapper.getCreateUserMapper(request);
            return await this.repository.createUser(userPayload);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:createUser`,
                status: 500,
            };

            getLogger(log);
        }
    }
}
