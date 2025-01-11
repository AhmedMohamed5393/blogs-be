import { PostRepository } from "../repositories/postRepository";
import { IPostRepository } from "../models/interfaces/classes/IPostRepository";
import { PostRepositoriesFactory } from "../repositories/postRepositoriesFactory";
import { IPostService } from "../models/interfaces/classes/IPostService";
import { getLogger } from "../../../shared/utils/helpers";
import { ICreatePostRequest } from "../models/interfaces/requests/ICreatePostRequest";
import { IUpdatePostRequest } from "../models/interfaces/requests/IUpdatePostRequest";
import { PageOptionsDto } from "../../../shared/pagination/pageOption.dto";
import { PostMapper } from "../mappers/post.mapper";

const TAG = "blogs-be:post:postService";

export class PostService implements IPostService {
    private repository: PostRepository;
    private repositoriesFactory: PostRepositoriesFactory;
    private postMapper: PostMapper;

    constructor(repository?: PostRepository) {
        if (!repository) {
            this.repositoriesFactory = PostRepositoriesFactory.Instance;

            this.repository = this.repositoriesFactory.getRepository(PostRepository.name) as any;
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

    public async getPaginatedList(pageOptionsDto: PageOptionsDto, userId?: number): Promise<any> {
        try {
            const posts = await this.repository.findMany(pageOptionsDto, userId);
            const data = this.postMapper.getItemsWithLikesMapper(posts);
            const total = await this.repository.count(userId);
            const meta = this.postMapper.getPageMetaMapper(total, data.length, pageOptionsDto);
            return { meta, data };
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:getPaginatedList`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async getOneById(id: number, userId?: number): Promise<any> {
        try {
            const post = await this.repository.findUnique(id, userId);
            const mappedItems = this.postMapper.getItemsWithLikesMapper([post]);
            return mappedItems[0];
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:getOneById`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async checkExistence(id: number, userId?: number): Promise<any> {
        try {
            return await this.repository.is_exists(id, userId);
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
