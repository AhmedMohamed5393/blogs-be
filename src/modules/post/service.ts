import { EventEmitter } from "events";
import { IPostService } from "./models/interfaces/classes/IPostService";
import { PostService } from "./services/postService";
import { IService } from "./models/interfaces/classes/IService";
import { getLogger } from "../../shared/utils/helpers";
import { ICreatePostRequest } from "./models/interfaces/requests/ICreatePostRequest";

const TAG = "blogs-be:post:service";

export class Service implements IService {
    private postService: IPostService;
    
    public static globalEvents = new EventEmitter();
    
    constructor() {
        this.postService = new PostService();
    }

    public async create(req: any, res: any, next: any): Promise<any> {
        try {
            const userId = +res.locals.user.id;
            const payload: ICreatePostRequest = {
                userId: userId,
                title: req.body.title,
                content: req.body.content,
            };
            const post = await this.postService.createPost(payload);

            return res.status(201).json({
                message: "Post is created successfully",
                data: post,
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
            const { userId, ...pageOptionsDto } = req.query;
            const data = await this.postService.getPaginatedList(pageOptionsDto, +userId);
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
            const userId = !res.locals.user?.id ? null : +res.locals.user?.id;
            const data = await this.postService.getOneById(id, userId);
            if (!data) {
                return res.status(404).json({ message: "Post isn't found" });
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

            const is_post_exists = await this.postService.checkExistence(+id, userId);
            if (!is_post_exists) {
                return res.status(422).json({ message: "Post isn't found" });
            }

            const post = await this.postService.updatePost(+id, body);

            return res.status(200).json({
                message: "Post is updated successfully",
                data: post,
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

            const is_post_exists = await this.postService.checkExistence(id, userId);
            if (!is_post_exists) {
                return res.status(422).json({ message: "Post isn't found" });
            }

            await this.postService.deletePost(id);
            return res.status(200).json({ message: "Post is removed successfully" });
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
