import { ILikeRepository } from "../models/interfaces/classes/ILikeRepository";
import { getLogger } from "../../../shared/utils/helpers";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Database } from "../../../database/database";

const TAG = "blogs-be:like:likeRepository";

export class LikeRepository implements ILikeRepository {
    private database: Database;
    private likeModel: Prisma.LikeDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
        
    constructor() {
        this.database = new Database();
        this.likeModel = this.database.getRepository('like');
    }

    public async create(itemId: number, type: string, userId: number): Promise<any> {
        try {
            const childKey = `${type}Like`;
            const foreignKey = `${type}Id`;

            return await this.likeModel.create({
                data: {
                  [childKey]: {
                    create: { [foreignKey]: itemId, userId: userId },
                  },
                },
                include: { postLike: true },
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:insert`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async findFirst(itemId: number, type: string, userId: number): Promise<any> {
        try {
            const childKey = `${type}Like`;
            const foreignKey = `${type}Id`;

            return await this.likeModel.findFirst({
                where: {
                    [childKey]: { [foreignKey]: itemId, userId: userId },
                },
                select: { id: true, deletedAt: true },
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:insert`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async update(id: number, is_liked: boolean): Promise<any> {
        try {
            return await this.likeModel.update({
                where: { id: id },
                data: { deletedAt: !is_liked ? null : new Date() },
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:soft_delete`,
                status: 500,
            };

            getLogger(log);
        }
    }
}
