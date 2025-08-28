import { BaseEntity } from "./baseEnitty";
import { User } from "./user";

export interface Couple extends BaseEntity {
    userOneId: User['id'];
    userTwoId: User['id'];
}

