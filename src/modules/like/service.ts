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
            const userId = +res.locals.user.id;
            const itemId = +req.body.postId;

            const item = await this.likeService.checkExistenceOfPostItem(itemId, userId);
            if (!item) {
                return res.status(422).json({ message: "Item isn't found" });
            }

            const is_liked = await this.putLikeOnItem(itemId, 'post', userId);
            const action = !is_liked ? 'unliked' : 'liked';
            return res.status(200).json({
                message: `Item is ${action} successfully`,
                is_liked: is_liked,
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
            const userId = +res.locals.user.id;
            const itemId = +req.body.commentId;

            const item = await this.likeService.checkExistenceOfCommentItem(itemId, userId);
            if (!item) {
                return res.status(422).json({ message: "Item isn't found" });
            }

            const is_liked = await this.putLikeOnItem(itemId, 'comment', userId);
            const action = !is_liked ? 'unliked' : 'liked';
            return res.status(200).json({
                message: `Item is ${action} successfully`,
                is_liked: is_liked,
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

    private async putLikeOnItem(itemId: number, type: string, userId: number) {
        const like = await this.likeService.checkExistenceOfLike(itemId, type, userId);
            
        let result;
        if (!like) {
            // put like for the first time only per user and post
            result = await this.likeService.createLikeToItemByType(itemId, type, userId);
        } else {
            // switch between like and unlike
            result = await this.likeService.assignLikeToItemById(like.id, !like.deletedAt);
        }

        const is_liked = !result.deletedAt;
        return is_liked;
    }
}
