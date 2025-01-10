import { IConfig, IEndpoint } from "../../shared/interfaces/IConfig";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import { MiddlewareFactory } from "../../shared/middlewares/middlewareFactory";
import { validationMiddleware } from "../../shared/middlewares/validationMiddleware";
import { CreateDto } from "./models/dtos/create.dto";
import { UpdateDto } from "./models/dtos/update.dto";

export class ServiceConfig implements IConfig {
    public middlewares = [
        { handler: bodyparser.json() },
        { "handler": cookieParser() },
    ];

    public middlewareFactory = new MiddlewareFactory();
    
    public endpoints: IEndpoint[] = [
        {
            url: "/",
            verb: "post",
            middlewares: [
                this.middlewareFactory.getMiddleware('AuthMiddleware').execute,
                validationMiddleware(CreateDto),
            ],
            function: "create",
        },
        {
            url: "/",
            verb: "get",
            middlewares: [this.middlewareFactory.getMiddleware('AuthMiddleware').execute],
            function: "findAll",
        },
        {
            url: "/:id",
            verb: "get",
            middlewares: [
                this.middlewareFactory.getMiddleware('AuthMiddleware').execute,
                this.middlewareFactory.getMiddleware('IdValidationMiddleware').execute,
            ],
            function: "findOne",
        },
        {
            url: "/:id",
            verb: "put",
            middlewares: [
                this.middlewareFactory.getMiddleware('AuthMiddleware').execute,
                this.middlewareFactory.getMiddleware('IdValidationMiddleware').execute,
                validationMiddleware(UpdateDto),
            ],
            function: "update",
        },
        {
            url: "/:id",
            verb: "delete",
            middlewares: [
                this.middlewareFactory.getMiddleware('AuthMiddleware').execute,
                this.middlewareFactory.getMiddleware('IdValidationMiddleware').execute,
            ],
            function: "delete",
        },
    ];
}
