import { EventEmitter } from "events";
import { ICommentService } from "./models/interfaces/classes/ICommentService";
import { CommentService } from "./services/commentService";
import { IService } from "./models/interfaces/classes/IService";
import { getLogger } from "../../shared/utils/helpers";

const TAG = "blogs-be:comment:service";

export class Service implements IService {
    private commentService: ICommentService;
    
    public static globalEvents = new EventEmitter();
    
    constructor() {
        this.commentService = new CommentService();
    }

    public async create(req: any, res: any, next: any): Promise<any> {
        try {
            return res.status(201).json({
                message: "Comment is created successfully",
                data: {},
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
            return res.status(201).json({
                data: [],
            });
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
            return res.status(201).json({
                data: {},
            });
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
            return res.status(201).json({
                message: "Comment is updated successfully",
                data: {},
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
            return res.status(201).json({
                message: "Comment is removed successfully",
                data: {},
            });
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
