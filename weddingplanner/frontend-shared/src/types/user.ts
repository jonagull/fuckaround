import { BaseEntity } from "./baseEntity";
import { UserEvent } from "./userEvent";

export interface User extends BaseEntity {
  name: string;

  email: string;
  phoneNumber: string;
  userEvents: UserEvent[];
}

/**
 * Params for the get user route api/users/:id
 */
export interface GetUserParams {
  id: string;
}