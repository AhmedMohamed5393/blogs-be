import { CommentRepository } from "../repositories/commentRepository";
import { ICommentRepository } from "../models/interfaces/classes/ICommentRepository";
import { CommentRepositoriesFactory } from "../repositories/commentRepositoriesFactory";
import { ICommentService } from "../models/interfaces/classes/ICommentService";

const TAG = "blogs-be:comment:commentService";

export class CommentService implements ICommentService {
    private repository: ICommentRepository;
    private repositoriesFactory: CommentRepositoriesFactory;

    constructor(repository?: ICommentRepository) {
        if (!repository) {
            this.repositoriesFactory = CommentRepositoriesFactory.Instance;

            this.repository = this.repositoriesFactory.getRepository(CommentRepository.name);
        } else {
            this.repository = repository;
        }
    }
}
