import { EventEmitter } from "events";
import { ILikeService } from "./models/interfaces/classes/ILikeService";
import { LikeService } from "./services/likeService";
import { IService } from "./models/interfaces/classes/IService";
import { getLogger } from "../../shared/utils/helpers";

const TAG = "blogs-be:like:service";

export class Service implements IService {
    private likeService: ILikeService;
    
    public static globalEvents = new EventEmitter();
    
    constructor() {
        this.likeService = new LikeService();
    }

    public async putLikeOnPost(req: any, res: any, next: any): Promise<any> {
        try {
            const action = 'liked'; // liked or unliked
            
            return res.status(201).json({
                message: `Item is ${action} successfully`,
                data: {},
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:putLikeOnPost`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }

    public async putLikeOnComment(req: any, res: any, next: any): Promise<any> {
        try {
            const action = 'liked'; // liked or unliked
            
            return res.status(201).json({
                message: `Item is ${action} successfully`,
                data: {},
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:putLikeOnComment`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }
}
