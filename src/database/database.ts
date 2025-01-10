import { EventEmitter } from "events";
import { getLogger } from "../shared/utils/helpers";
import { ILogger } from "../shared/interfaces/ILogger";
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from "@prisma/client/runtime/library";

const TAG = "blogs-be:database";

export class Database {
    private isConnected = false;
    public static events = new EventEmitter();
    public connection: PrismaClient;

    constructor() {
        this.initialize();
    }

    public getRepository(entity: string) {
        try {
            if (!this.isConnected) {
                this.isConnected = true;
            }

            return this.connection[entity];
        } catch (error) {
            const log: ILogger = { message: error, tag: TAG, status: 500 };
            getLogger(log);
        }
    }

    public destroy() {        
        this.connection.$disconnect();
    }

    private async initialize() {
        this.connection = new PrismaClient();
        this.connection.$connect();

        Database.events.once(
            "database connected",
            () => console.log("Fire database-connected"),
        );

        Database.events.once(
            "database disconnected",
            () => console.log("Fire database-disconnected"),
        );
    }
}
