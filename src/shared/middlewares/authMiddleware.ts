import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "../interfaces/IMiddleware";
import { getLogger } from "../utils/helpers";
import { getUserData, verifyToken } from "../utils/jwt";

const TAG = "blogs-be:authMiddleware";

export class AuthMiddleware implements IMiddleware {
    constructor() {}

    public async execute(req: Request, res: Response, next: NextFunction) {
        const { cookies, headers } = req;
        
        try {
            const credentials: string = cookies?.token || headers?.authorization;
            if (!credentials || !credentials.startsWith("eyJ")) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const token: string = credentials || credentials.split(" ")[1];
            const payload = verifyToken(token);
            res.locals.user = await getUserData(payload.username);
            
            next();
        } catch (error) {
            const log = {
                message: error,
                tag: TAG,
                status: 500,
            };

            getLogger(log);

            return res.status(401).json({ message: "Unauthorized" });
        }
    }
}
