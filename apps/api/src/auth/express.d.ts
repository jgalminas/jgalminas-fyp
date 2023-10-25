import { IUser } from '@fyp/mongodb';


declare global {
  namespace Express {
    export interface User extends IUser { }
  }
}
