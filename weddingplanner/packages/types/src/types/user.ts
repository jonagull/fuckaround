import { BaseEntity } from "./baseEntity";

export interface User extends BaseEntity {
    name: string;

    email: string;
    phoneNumber: string;
}


/**
 * Params for the get user route api/users/:id
 */
export interface GetUserParams {
    id: string;
}