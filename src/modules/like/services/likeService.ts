import { LikeRepository } from "../repositories/likeRepository";
import { ILikeRepository } from "../models/interfaces/classes/ILikeRepository";
import { LikeRepositoriesFactory } from "../repositories/likeRepositoriesFactory";
import { ILikeService } from "../models/interfaces/classes/ILikeService";
import { getLogger } from "../../../shared/utils/helpers";
import { IPostService } from "../../post/models/interfaces/classes/IPostService";
import { ICommentService } from "../../comment/models/interfaces/classes/ICommentService";
import { PostService } from "../../post/services/postService";
import { CommentService } from "../../comment/services/commentService";

const TAG = "blogs-be:like:likeService";

export class LikeService implements ILikeService {
    private repository: ILikeRepository;
    private repositoriesFactory: LikeRepositoriesFactory;
    private postService: IPostService;
    private commentService: ICommentService;

    constructor(repository?: ILikeRepository) {
        if (!repository) {
            this.repositoriesFactory = LikeRepositoriesFactory.Instance;

            this.repository = this.repositoriesFactory.getRepository(LikeRepository.name);
        } else {
            this.repository = repository;
        }

        this.postService = new PostService();
        this.commentService = new CommentService();
    }

    public async createLikeToItemByType(itemId: number, type: string, userId: number): Promise<any> {
        try {
            return await this.repository.create(itemId, type, userId);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:assignLikeToItemByType`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async checkExistenceOfLike(itemId: number, type: string, userId: number): Promise<any> {
        try {
            return await this.repository.findFirst(itemId, type, userId);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:checkExistenceOfLike`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async assignLikeToItemById(id: number, is_liked: boolean): Promise<any> {
        try {
            return await this.repository.update(id, is_liked);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:unassignLikeToItemById`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async checkExistenceOfPostItem(id: number, userId: number): Promise<any> {
        try {
            return await this.postService.checkExistence(id, userId);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:checkExistenceOfPostItem`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async checkExistenceOfCommentItem(id: number, userId: number): Promise<any> {
        try {
            return await this.commentService.checkExistence(id, userId);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:checkExistenceOfCommentItem`,
                status: 500,
            };

            getLogger(log);
        }
    }
}
