import { Router } from "express";
import { ILogger } from "../interfaces/ILogger";
import { IEndpoint } from "../interfaces/IConfig";

export function generateRandom (
    length = 255,
    numbersOnly = false,
) {
    let result = '';
    const characters = numbersOnly
      ? '0123456789'
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(
                Math.random() * charactersLength,
            ),
        );
    }

    return result;
};

export function getLogger(log: ILogger) {
    log.status >= 400 ? console.error(log) : console.log(log);
}

export function getRoutes(
    part_url: string,
    router: Router,
    config: any,
    service: any,
) {
    config.middlewares.forEach((middleware: any) => router.use(middleware.handler));
    
    config.endpoints.forEach(
        (endpoint: IEndpoint) => {
            return router[endpoint.verb.toLowerCase()](
                `${part_url}${endpoint.url}`,
                endpoint.middlewares,
                service[endpoint.function].bind(service),
            );
        },
    );

    return router;
}
