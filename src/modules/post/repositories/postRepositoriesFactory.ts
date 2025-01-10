import { PostRepository } from "./postRepository";
import { IPostRepository } from "../models/interfaces/classes/IPostRepository";

export class PostRepositoriesFactory {
    constructor() {
        this.repositoriesMap = new Map<string, IPostRepository>();

        this.createRepositories();
    }

    private repositoriesMap: Map<string, IPostRepository>;

    private static instance: PostRepositoriesFactory;

    public static get Instance() {
        return PostRepositoriesFactory.instance || (
            PostRepositoriesFactory.instance = new PostRepositoriesFactory()
        );
    }

    public getRepository(repositoryName: string) {
        return this.repositoriesMap.get(repositoryName);
    }

    private createRepositories() {
        this.repositoriesMap.set(
            PostRepository.name,
            new PostRepository(),
        );
    }
}
