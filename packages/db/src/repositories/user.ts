import { db } from "../db";
import { User, user } from "../schema/user";

export const addUser = async(data: User) => {
  await db.insert(user).values(data);
}