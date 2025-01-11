import { CommentRepository } from "../repositories/commentRepository";
import { ICommentRepository } from "../models/interfaces/classes/ICommentRepository";
import { CommentRepositoriesFactory } from "../repositories/commentRepositoriesFactory";
import { ICommentService } from "../models/interfaces/classes/ICommentService";
import { PageOptionsDto } from "../../../shared/pagination/pageOption.dto";
import { getLogger } from "../../../shared/utils/helpers";
import { CommentMapper } from "../mappers/comment.mapper";
import { ICreateCommentRequest } from "../models/interfaces/requests/ICreateCommentRequest";
import { IUpdateCommentRequest } from "../models/interfaces/requests/IUpdateCommentRequest";

const TAG = "blogs-be:comment:commentService";

export class CommentService implements ICommentService {
    private repository: ICommentRepository;
    private repositoriesFactory: CommentRepositoriesFactory;
    private commentMapper: CommentMapper;

    constructor(repository?: ICommentRepository) {
        if (!repository) {
            this.repositoriesFactory = CommentRepositoriesFactory.Instance;

            this.repository = this.repositoriesFactory.getRepository(CommentRepository.name);
        } else {
            this.repository = repository;
        }

        this.commentMapper = new CommentMapper();
    }

    public async createComment(createDto: ICreateCommentRequest): Promise<any> {
        try {
            return await this.repository.create(createDto);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:createComment`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async getPaginatedList(userId: number, pageOptionsDto: PageOptionsDto, postId?: number): Promise<any> {
        try {
            const comments = await this.repository.findMany(userId, pageOptionsDto, postId);
            const items = this.commentMapper.getItemsWithLikesMapper(comments, userId);
            const total = await this.repository.count(userId);
            const result = this.commentMapper.getPaginatedListMapper(total, items.length, pageOptionsDto);
            return result;
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:getPaginatedList`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async getOneById(id: number): Promise<any> {
        try {
            const comment = await this.repository.findUnique(id);
            comment.likes = comment.likes.length;

            return comment;
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:getOneById`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async checkExistence(id: number, userId: number, postId?: number): Promise<any> {
        try {
            return await this.repository.is_exists(id, userId, postId);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:checkExistence`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async updateComment(id: number, data: IUpdateCommentRequest): Promise<any> {
        try {
            return await this.repository.update(id, data);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:updateComment`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async deleteComment(id: number): Promise<any> {
        try {
            return await this.repository.soft_delete(id);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:deleteComment`,
                status: 500,
            };

            getLogger(log);
        }
    }
}
