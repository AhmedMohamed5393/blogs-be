import { PostRepository } from "../repositories/postRepository";
import { IPostRepository } from "../models/interfaces/classes/IPostRepository";
import { PostRepositoriesFactory } from "../repositories/postRepositoriesFactory";
import { IPostService } from "../models/interfaces/classes/IPostService";
import { getLogger } from "../../../shared/utils/helpers";
import { ICreatePostRequest } from "../models/interfaces/requests/ICreatePostRequest";
import { IUpdatePostRequest } from "../models/interfaces/requests/IUpdatePostRequest";
import { PageOptionsDto } from "../../../shared/pagination/pageOption.dto";
import { PageMeta } from "../../../shared/pagination/page-meta";
import { PostMapper } from "../mappers/post.mapper";

const TAG = "blogs-be:post:postService";

export class PostService implements IPostService {
    private repository: IPostRepository;
    private repositoriesFactory: PostRepositoriesFactory;
    private postMapper: PostMapper;

    constructor(repository?: IPostRepository) {
        if (!repository) {
            this.repositoriesFactory = PostRepositoriesFactory.Instance;

            this.repository = this.repositoriesFactory.getRepository(PostRepository.name);
        } else {
            this.repository = repository;
        }

        this.postMapper = new PostMapper();
    }

    public async createPost(createDto: ICreatePostRequest): Promise<any> {
        try {
            return await this.repository.create(createDto);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:createPost`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async getPaginatedList(userId: number, pageOptionsDto: PageOptionsDto): Promise<any> {
        try {
            const items = await this.repository.findMany(userId, pageOptionsDto);
            const total = await this.repository.count(userId);
            const result = this.postMapper.getPostsListMapper(total, pageOptionsDto, items);
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
            const post = await this.repository.findUnique(id);
            post.likes = post.likes.length;

            return post;
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:getOneById`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async checkExistence(id: number): Promise<any> {
        try {
            return await this.repository.is_exists(id);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:checkExistence`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async updatePost(id: number, data: IUpdatePostRequest): Promise<any> {
        try {
            return await this.repository.update(id, data);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:updatePost`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async deletePost(id: number): Promise<any> {
        try {
            return await this.repository.soft_delete(id);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:deletePost`,
                status: 500,
            };

            getLogger(log);
        }
    }
}
