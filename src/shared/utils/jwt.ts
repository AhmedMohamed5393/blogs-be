import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../environment";
import { UserService } from "../../modules/user/services/userService";

export function encryptToken(payload: any): any {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

export async function getUserData(email?: string) {
    if (!email) return;

    const userService = new UserService();
    return await userService.getUserBy({ email }, { id: true });
}

export function decryptToken(token: string): any {
    return jwt.decode(token);
}

export function verifyToken(token: string): any {
    return jwt.verify(token, SECRET_KEY);
}
