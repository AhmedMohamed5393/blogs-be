import { LikeRepository } from "./likeRepository";
import { ILikeRepository } from "../models/interfaces/classes/ILikeRepository";

export class LikeRepositoriesFactory {
    constructor() {
        this.repositoriesMap = new Map<string, ILikeRepository>();

        this.createRepositories();
    }

    private repositoriesMap: Map<string, ILikeRepository>;

    private static instance: LikeRepositoriesFactory;

    public static get Instance() {
        return LikeRepositoriesFactory.instance || (
            LikeRepositoriesFactory.instance = new LikeRepositoriesFactory()
        );
    }

    public getRepository(repositoryName: string) {
        return this.repositoriesMap.get(repositoryName);
    }

    private createRepositories() {
        this.repositoriesMap.set(
            LikeRepository.name,
            new LikeRepository(),
        );
    }
}
