import { IPostRepository } from "../models/interfaces/classes/IPostRepository";
import { getLogger } from "../../../shared/utils/helpers";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Database } from "../../../database/database";

const TAG = "blogs-be:post:postRepository";

export class PostRepository implements IPostRepository {
    private database: Database;
    private repository: Prisma.PostDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
    
    constructor() {
        this.database = new Database();
        this.repository = this.database.getRepository('post');
    }
}
