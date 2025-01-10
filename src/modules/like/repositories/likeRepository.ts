import { ILikeRepository } from "../models/interfaces/classes/ILikeRepository";
import { getLogger } from "../../../shared/utils/helpers";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Database } from "../../../database/database";

const TAG = "blogs-be:like:likeRepository";

export class LikeRepository implements ILikeRepository {
    private database: Database;
    private repository: Prisma.LikeDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
        
    constructor() {
        this.database = new Database();
        this.repository = this.database.getRepository('like');
    }
}
