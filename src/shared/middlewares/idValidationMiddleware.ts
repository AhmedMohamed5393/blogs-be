import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "../interfaces/IMiddleware";
import { getLogger } from "../utils/helpers";

const TAG = "blogs-be:idValidationMiddleware";

export class IdValidationMiddleware implements IMiddleware {
    constructor() {}

    public async execute(req: Request, res: Response, next: NextFunction) {        
        try {
            const id = req.params.id;
            if (!id || !Number(id)) {
                return res.status(400).json({ message: "Invalid id" });
            }
            
            next();
        } catch (error) {
            const log = { message: error, tag: `${TAG}:idValidationMiddleware`, status: 500 };

            getLogger(log);
        }
    }
}
