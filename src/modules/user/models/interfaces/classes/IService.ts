import * as express from "express";

export interface IService {
    signup(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;

    signin(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
}
