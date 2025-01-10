import { LikeRepository } from "../repositories/likeRepository";
import { ILikeRepository } from "../models/interfaces/classes/ILikeRepository";
import { LikeRepositoriesFactory } from "../repositories/likeRepositoriesFactory";
import { ILikeService } from "../models/interfaces/classes/ILikeService";

const TAG = "blogs-be:like:likeService";

export class LikeService implements ILikeService {
    private repository: ILikeRepository;
    private repositoriesFactory: LikeRepositoriesFactory;

    constructor(repository?: ILikeRepository) {
        if (!repository) {
            this.repositoriesFactory = LikeRepositoriesFactory.Instance;

            this.repository = this.repositoriesFactory.getRepository(LikeRepository.name);
        } else {
            this.repository = repository;
        }
    }
}
