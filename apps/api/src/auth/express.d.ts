import { User as IUser } from '@fyp/db';


declare global {
  namespace Express {
    export interface User extends IUser { }
  }
}
