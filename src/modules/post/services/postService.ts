import { PostRepository } from "../repositories/postRepository";
import { IPostRepository } from "../models/interfaces/classes/IPostRepository";
import { PostRepositoriesFactory } from "../repositories/postRepositoriesFactory";
import { IPostService } from "../models/interfaces/classes/IPostService";

const TAG = "blogs-be:post:postService";

export class PostService implements IPostService {
    private repository: IPostRepository;
    private repositoriesFactory: PostRepositoriesFactory;

    constructor(repository?: IPostRepository) {
        if (!repository) {
            this.repositoriesFactory = PostRepositoriesFactory.Instance;

            this.repository = this.repositoriesFactory.getRepository(PostRepository.name);
        } else {
            this.repository = repository;
        }
    }
}
