import { IPostRepository } from "../models/interfaces/classes/IPostRepository";
import { getLogger } from "../../../shared/utils/helpers";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Database } from "../../../database/database";
import { ICreatePostRequest } from "../models/interfaces/requests/ICreatePostRequest";
import { IUpdatePostRequest } from "../models/interfaces/requests/IUpdatePostRequest";
import { PageOptionsDto } from "../../../shared/pagination/pageOption.dto";

const TAG = "blogs-be:post:postRepository";

export class PostRepository implements IPostRepository {
    private database: Database;
    private postModel: Prisma.PostDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
    
    constructor() {
        this.database = new Database();
        this.postModel = this.database.getRepository('post');
    }

    public async create(data: ICreatePostRequest): Promise<any> {
        try {
            return await this.postModel.create({ data });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:create`,
                status: 500,
            };

            getLogger(log);
        }
    }
    
    public async count(userId: number): Promise<any> {
        try {
            return await this.postModel.count({ where: { userId: userId, deletedAt: null } });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:count`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async findMany(userId: number, pageOptionsDto: PageOptionsDto): Promise<any> {
        try {
            const take = +pageOptionsDto.take || 10;
            const skip = (pageOptionsDto.page - 1) * take || 0;

            return await this.postModel.findMany({
                where: { userId: userId, deletedAt: null },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    user: { select: { id: true, name: true } },
                    likes: {
                        where: { deletedAt: null },
                        select: { id: true },
                    },
                },
                skip: skip,
                take: take,
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:findMany`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async findUnique(id: number): Promise<any> {
        try {
            return await this.postModel.findUnique({
                where: { id: id, deletedAt: null },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    user: { select: { id: true, name: true } },
                    likes: {
                        where: { deletedAt: null },
                        select: { id: true },
                    },
                    comments: {
                        where: { deletedAt: null },
                        select: {
                            id: true,
                            content: true,
                            user: { select: { id: true, name: true } },
                        },
                        orderBy: { createdAt: 'desc' },
                        take: 10,
                    },
                },
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:findUnique`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async is_exists(id: number, userId: number): Promise<any> {
        try {
            return await this.postModel.findUnique({
                where: { id: id, userId: userId, deletedAt: null },
                select: { id: true },
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:is_exists`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async update(id: number, data: IUpdatePostRequest): Promise<any> {
        try {
            return await this.postModel.update({ where: { id }, data });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:update`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async soft_delete(id: number): Promise<any> {
        try {
            return await this.postModel.update({
                where: { id },
                data: { deletedAt: new Date() },
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
