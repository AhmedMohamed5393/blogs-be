import { ICommentRepository } from "../models/interfaces/classes/ICommentRepository";
import { getLogger } from "../../../shared/utils/helpers";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Database } from "../../../database/database";
import { PageOptionsDto } from "../../../shared/pagination/pageOption.dto";
import { ICreateCommentRequest } from "../models/interfaces/requests/ICreateCommentRequest";
import { IUpdateCommentRequest } from "../models/interfaces/requests/IUpdateCommentRequest";

const TAG = "blogs-be:comment:commentRepository";

const select_likes = (where: any) => {
    return !where['userId'] ? {} : {
        likes: {
            where: where,
            select: { id: true },
            take: 1,
        },
    };
};

export class CommentRepository implements ICommentRepository {
    private database: Database;
    private commentModel: Prisma.CommentDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
        
    constructor() {
        this.database = new Database();
        this.commentModel = this.database.getRepository('comment');
    }

    public async create(data: ICreateCommentRequest): Promise<any> {
        try {
            return await this.commentModel.create({ data });
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
            const where = { deletedAt: null };
            if (userId) {
                where['userId'] = userId;
            }

            return await this.commentModel.count({ where });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:count`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async findMany(pageOptionsDto: PageOptionsDto, userId?: number, postId?: number): Promise<any> {
        try {
            const take = +pageOptionsDto.take || 10;
            const skip = (pageOptionsDto.page - 1) * take || 0;

            const where = { deletedAt: null };
            if (postId) {
                where['postId'] = postId;
            }

            const like_condition = { like: { deletedAt: null } };
            if (userId) {
                where['userId'] = userId;
                like_condition['userId'] = userId;
            }

            return await this.commentModel.findMany({
                where: where,
                select: {
                    id: true,
                    content: true,
                    user: { select: { id: true, name: true } },
                    ...select_likes(like_condition),
                    _count: {
                        select: {
                            likes: {
                                where: { like: { deletedAt: null } },
                            },
                        },
                    },
                },
                skip: skip,
                take: take,
                orderBy: { createdAt: 'asc' },
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

    public async findUnique(id: number, userId?: number): Promise<any> {
        try {
            const where = { deletedAt: null, like: { deletedAt: null } };
            if (userId) {
                where['userId'] = userId;
            }

            return await this.commentModel.findUnique({
                where: { id: id, deletedAt: null },
                select: {
                    id: true,
                    content: true,
                    user: { select: { id: true, name: true } },
                    post: {
                        select: {
                            id: true,
                            title: true,
                            content: true,
                            user: { select: { id: true, name: true } },
                        },
                    },
                    ...select_likes(where),
                    _count: {
                        select: {
                            likes: {
                                where: { like: { deletedAt: null } },
                            },
                        },
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

    public async is_exists(id: number, userId?: number, postId?: number): Promise<any> {
        try {
            const where = {
                id: id,
                deletedAt: null,
            };
            if (userId) {
                where['userId'] = userId;
            }
            if (postId) {
                where['postId'] = postId;
            }

            return await this.commentModel.findUnique({
                where: where,
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

    public async update(id: number, data: IUpdateCommentRequest): Promise<any> {
        try {
            return await this.commentModel.update({ where: { id }, data });
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
            return await this.commentModel.update({
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
