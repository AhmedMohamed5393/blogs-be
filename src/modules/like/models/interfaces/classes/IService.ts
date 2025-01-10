import * as express from "express";

export interface IService {
    putLikeOnPost(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
    putLikeOnComment(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
}
