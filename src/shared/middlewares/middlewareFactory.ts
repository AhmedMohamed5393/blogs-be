import { IMiddleware } from "../interfaces/IMiddleware";
import { IMiddlewareFactory } from "../interfaces/IMiddlewareFactory";
import { AuthMiddleware } from "./authMiddleware";
import { CheckUserTypeMiddleware } from "./checkUserTypeMiddleware";
import { IdValidationMiddleware } from "./idValidationMiddleware";

export class MiddlewareFactory implements IMiddlewareFactory {
    private middlewareMap: Map<string, IMiddleware>;

    constructor() {
        this.middlewareMap = new Map<string, IMiddleware>();
        this.createMiddlewares();
    }

    public getMiddleware(middlewareName: string): IMiddleware {
        return this.middlewareMap.get(middlewareName);
    }
    
    private createMiddlewares(): void {
        this.middlewareMap.set(AuthMiddleware.name, new AuthMiddleware());
        this.middlewareMap.set(IdValidationMiddleware.name, new IdValidationMiddleware());
        this.middlewareMap.set(CheckUserTypeMiddleware.name, new CheckUserTypeMiddleware());
    }
}

export default MiddlewareFactory;
