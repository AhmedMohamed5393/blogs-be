import * as express from "express";

export interface IService {
    create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
    findAll(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
    findOne(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
    update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
    delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
}
