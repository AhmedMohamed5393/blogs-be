import { EventEmitter } from "events";
import { IPostService } from "./models/interfaces/classes/IPostService";
import { PostService } from "./services/postService";
import { IService } from "./models/interfaces/classes/IService";
import { getLogger } from "../../shared/utils/helpers";

const TAG = "blogs-be:post:service";

export class Service implements IService {
    private postService: IPostService;
    
    public static globalEvents = new EventEmitter();
    
    constructor() {
        this.postService = new PostService();
    }

    public async create(req: any, res: any, next: any): Promise<any> {
        try {
            return res.status(201).json({
                message: "Post is created successfully",
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
            return res.status(200).json({
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
            return res.status(200).json({
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
            return res.status(200).json({
                message: "Post is updated successfully",
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
            return res.status(200).json({
                message: "Post is removed successfully",
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
