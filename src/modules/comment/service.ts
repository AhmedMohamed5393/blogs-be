import { EventEmitter } from "events";
import { ICommentService } from "./models/interfaces/classes/ICommentService";
import { CommentService } from "./services/commentService";
import { IService } from "./models/interfaces/classes/IService";
import { getLogger } from "../../shared/utils/helpers";
import { ICreateCommentRequest } from "./models/interfaces/requests/ICreateCommentRequest";

const TAG = "blogs-be:comment:service";

export class Service implements IService {
    private commentService: ICommentService;
    
    public static globalEvents = new EventEmitter();
    
    constructor() {
        this.commentService = new CommentService();
    }

    public async create(req: any, res: any, next: any): Promise<any> {
        try {
            const userId = +res.locals.user.id;
            const payload: ICreateCommentRequest = {
                userId: userId,
                postId: req.body.postId,
                content: req.body.content,
            };
            const comment = await this.commentService.createComment(payload);
            if (!comment) {
                return res.status(422).json({ message: "Post isn't found" });
            }

            return res.status(201).json({
                message: "Comment is created successfully",
                data: comment,
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:create`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }

    public async findAll(req: any, res: any, next: any): Promise<any> {
        try {
            const { postId, userId, ...pageOptionsDto } = req.query;
            const data = await this.commentService.getPaginatedList(pageOptionsDto, +userId, +postId);
            return res.status(200).json(data);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:findAll`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }

    public async findOne(req: any, res: any, next: any): Promise<any> {
        try {
            const id = +req.params.id;
            const data = await this.commentService.getOneById(id);
            if (!data) {
                return res.status(404).json({ message: "Comment isn't found" });
            }

            return res.status(200).json(data);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:findOne`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }

    public async update(req: any, res: any, next: any): Promise<any> {
        try {
            const userId = +res.locals.user.id;
            const { params: { id }, body } = req;

            const is_comment_exists = await this.commentService.checkExistence(+id, userId, +body.postId);
            if (!is_comment_exists) {
                return res.status(422).json({ message: "Comment isn't found" });
            }

            const comment = await this.commentService.updateComment(+id, body);

            return res.status(200).json({
                message: "Comment is updated successfully",
                data: comment,
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:update`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }
    
    public async delete(req: any, res: any, next: any): Promise<any> {
        try {
            const userId = +res.locals.user.id;
            const id = +req.params.id;

            const is_comment_exists = await this.commentService.checkExistence(id, userId);
            if (!is_comment_exists) {
                return res.status(422).json({ message: "Comment isn't found" });
            }

            await this.commentService.deleteComment(id);
            return res.status(200).json({ message: "Comment is removed successfully" });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:delete`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }
}
