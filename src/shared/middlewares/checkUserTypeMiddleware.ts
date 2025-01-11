import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "../interfaces/IMiddleware";
import { getLogger } from "../utils/helpers";
import { decryptToken, getUserData } from "../utils/jwt";

const TAG = "blogs-be:checkUserTypeMiddleware";

export class CheckUserTypeMiddleware implements IMiddleware {
    constructor() {}

    public async execute(req: Request, res: Response, next: NextFunction) {
        const { cookies, headers } = req;
        
        try {
            const credentials: string = cookies?.token || headers?.authorization;
            if (credentials) {
                const token: string = credentials || credentials.split(" ")[1];
                const payload = decryptToken(token);
                res.locals.user = await getUserData(payload?.username);
            }
            
            next();
        } catch (error) {
            const log = {
                message: error,
                tag: TAG,
                status: 500,
            };

            getLogger(log);
        }
    }
}
