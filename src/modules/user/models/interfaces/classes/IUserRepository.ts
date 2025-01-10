export interface IUserRepository {
    getUserBy(where: any, select?: any): Promise<any>;

    createUser(payload: any): Promise<any>;
}
