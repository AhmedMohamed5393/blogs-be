import { CommentRepository } from "./commentRepository";
import { ICommentRepository } from "../models/interfaces/classes/ICommentRepository";

export class CommentRepositoriesFactory {
    constructor() {
        this.repositoriesMap = new Map<string, ICommentRepository>();

        this.createRepositories();
    }

    private repositoriesMap: Map<string, ICommentRepository>;

    private static instance: CommentRepositoriesFactory;

    public static get Instance() {
        return CommentRepositoriesFactory.instance || (
            CommentRepositoriesFactory.instance = new CommentRepositoriesFactory()
        );
    }

    public getRepository(repositoryName: string) {
        return this.repositoriesMap.get(repositoryName);
    }

    private createRepositories() {
        this.repositoriesMap.set(
            CommentRepository.name,
            new CommentRepository(),
        );
    }
}
