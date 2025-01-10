import { Request, Response, NextFunction } from "express";
import { EventEmitter } from "events";
import { getLogger } from "../../shared/utils/helpers";
import { IUserService } from "./models/interfaces/classes/IUserService";
import { UserService } from "./services/userService";
import { IUserCheck } from "./models/interfaces/requests/IUserCheck";
import { comparePassword, encryptPassword } from "../../shared/utils/bcrypt";
import { ICreateUserRequest } from "./models/interfaces/requests/ICreateUserRequest";
import { IService } from "./models/interfaces/classes/IService";
import { encryptToken } from "../../shared/utils/jwt";

const TAG = "blogs-be:user:service";

export class Service implements IService {
    private userService: IUserService;
    
    public static globalEvents = new EventEmitter();
    
    constructor() {
        this.userService = new UserService();
    }

    public async signup(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { name, email } = req.body;

            // check existance of user by email or name
            const checkPayload: IUserCheck = { name, email };
            const user = await this.userService.checkExistance(checkPayload);
            if (user) {
                return res.status(403).json({ message: "User is already exists" });
            }

            // encode password
            const password = await encryptPassword(req.body.password);

            // create user
            const payload: ICreateUserRequest = {
                name,
                email,
                password,
            };

            const createdUser = await this.userService.createUser(payload);
            if (!createdUser) {
                return res.status(422).json({ message: "Can't create user" });
            }

            delete createdUser.password;

            // prepare response
            return res.status(201).json({
                message: "User is registered successfully",
                data: createdUser,
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:signup`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }
    
    public async signin(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { user, password } = req.body;

            // check existance of user by email or phone or name
            const checkPayload: IUserCheck = { name: user, email: user };
            const isExistUser = await this.userService.checkExistance(checkPayload);
            if (!isExistUser) {
                return res.status(404).json({ message: "User isn't found" });
            }

            // compare passwords
            const isMatch = await comparePassword(password, isExistUser.password);
            if (!isMatch) {
                return res.status(422).json({ message: "Passwords mismatch" });
            }

            const { id, name, email } = isExistUser;

            // prepare payload with generating jwt token
            const payload = {
                sub: id,
                username: email,
            };
            const token = encryptToken(payload);
            res.cookie('token', token);

            // prepare response
            return res.status(200).json({
                message: "User is logged in successfully",
                data: { id, name, email },
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:signin`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }

    public async signout(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            res.clearCookie('token');

            // prepare response
            return res.status(200).json({
                message: "User is logged out successfully",
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:signout`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }
}
