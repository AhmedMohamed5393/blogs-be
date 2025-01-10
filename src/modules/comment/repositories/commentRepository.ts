import { ICommentRepository } from "../models/interfaces/classes/ICommentRepository";
import { getLogger } from "../../../shared/utils/helpers";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Database } from "../../../database/database";

const TAG = "blogs-be:comment:commentRepository";

export class CommentRepository implements ICommentRepository {
    private database: Database;
    private repository: Prisma.CommentDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
        
    constructor() {
        this.database = new Database();
        this.repository = this.database.getRepository('comment');
    }
}
