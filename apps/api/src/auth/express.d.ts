import { IUser } from '@fyp/db';

declare global {
  namespace Express {
    export interface User extends Pick<IUser, "_id" | "email" | "username"> { }
  }
}
