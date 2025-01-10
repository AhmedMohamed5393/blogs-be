import { IConfig, IEndpoint } from "../../shared/interfaces/IConfig";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import { MiddlewareFactory } from "../../shared/middlewares/middlewareFactory";
import { validationMiddleware } from "../../shared/middlewares/validationMiddleware";
import { PutLikeOnCommentDto } from "./models/dtos/put-like-comment.dto";
import { PutLikeOnPostDto } from "./models/dtos/put-like-post.dto";

export class ServiceConfig implements IConfig {
    public middlewares = [
        { handler: bodyparser.json() },
        { "handler": cookieParser() },
    ];

    public middlewareFactory = new MiddlewareFactory();
    
    public endpoints: IEndpoint[] = [
        {
            url: "/post",
            verb: "patch",
            middlewares: [
                this.middlewareFactory.getMiddleware('AuthMiddleware').execute,
                validationMiddleware(PutLikeOnPostDto),
            ],
            function: "putLikeOnPost",
        },
        {
            url: "/comment",
            verb: "patch",
            middlewares: [
                this.middlewareFactory.getMiddleware('AuthMiddleware').execute,
                validationMiddleware(PutLikeOnCommentDto),
            ],
            function: "putLikeOnComment",
        },
    ];
}
