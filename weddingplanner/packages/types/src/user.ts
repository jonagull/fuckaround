import { BaseEntity } from "./baseEnitty";

export interface User extends BaseEntity {
    name: string;

    email: string;
    phoneNumber: string;
}