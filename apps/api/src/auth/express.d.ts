import { IUser } from '@fyp/types';

declare global {
  namespace Express {
    export interface User extends Pick<IUser, "_id" | "email" | "username" | "summoner"> { }
  }
}
