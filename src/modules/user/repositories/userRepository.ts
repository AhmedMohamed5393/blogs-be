import { IUserRepository } from "../models/interfaces/classes/IUserRepository";
import { getLogger } from "../../../shared/utils/helpers";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Database } from "../../../database/database";

const TAG = "blogs-be:user:userRepository";

export class UserRepository implements IUserRepository {
    private database: Database;
    private userModel: Prisma.UserDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
    
    constructor() {
        this.database = new Database();
        this.userModel = this.database.getRepository('user');
    }
    
    public async getUserBy(where: any, select: any): Promise<any> {
        try {
            return await this.userModel.findFirst({ select, where });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:getUserBy`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async createUser(data: any): Promise<any> {
        try {
            return await this.userModel.create({ data });
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
