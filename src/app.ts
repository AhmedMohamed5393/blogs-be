import 'reflect-metadata';
import Debug from "debug";
import express from "express";
import * as env from "./environment";
// import modules routes
import user from "./modules/user/router";
import post from "./modules/post/router";
import comment from "./modules/comment/router";
import like from "./modules/like/router";

const debug = Debug("blogs-be");
const app = express();
const port = env.PORT || 3000;
const host = env.HOST;

// use modules routes
app.use(user);
app.use(post);
app.use(comment);
app.use(like);

app.get("/", (req, res) => { res.send("App is up and running!"); });

app.use(notFoundHandler);
app.set("port", port);

app.listen(+port, host, () => {
    try {
        console.log(`The server is connected to http://${host}:${port}`);
    } catch (error) {
        throw error;
    }
});

module.exports = app;

function notFoundHandler(req: any, res: any) {
    debug(req.protocol + "://" + req.get("host") + req.originalUrl);

    return res.status(404).json({ error: "Not Found" });
}
