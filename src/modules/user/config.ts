import { IConfig, IEndpoint } from "../../shared/interfaces/IConfig";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import { MiddlewareFactory } from "../../shared/middlewares/middlewareFactory";
import { validationMiddleware } from "../../shared/middlewares/validationMiddleware";
import { CreateUserDto } from "./models/dtos/create-user.dto";
import { LoginDto } from "./models/dtos/login.dto";

export class ServiceConfig implements IConfig {
    public middlewares = [
        { handler: bodyparser.json() },
        { "handler": cookieParser() },
    ];

    public middlewareFactory = new MiddlewareFactory();
    
    public endpoints: IEndpoint[] = [
        {
            url: "/auth/signup",
            verb: "post",
            middlewares: [validationMiddleware(CreateUserDto)],
            function: "signup",
        },
        {
            url: "/auth/signin",
            verb: "post",
            middlewares: [validationMiddleware(LoginDto)],
            function: "signin",
        },
        {
            url: "/auth/signout",
            verb: "get",
            middlewares: [this.middlewareFactory.getMiddleware('AuthMiddleware').execute],
            function: "signout",
        },
    ];
}
