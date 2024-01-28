import { IUser } from "@fyp/types";
import { User } from "../schema/user";
import { Types } from "mongoose";

export type RegisterCredentials = {
  username: string,
  email: string,
  password: string
}

export const findUserByEmail = async(email: string): Promise<IUser | null> => User.findOne({ email });

export const findUserById = async(id: string): Promise<IUser | null> => User.findById(id);

export const createUser = async(credentials: RegisterCredentials) => {
  
  const user = await User.create(credentials);

  await user.save();
  return user;
}

export const updateSummoner = async(
  userId: string,
  summoner: {
    name: string,
    tag: string,
    profileIconId: number,
    puuid: string
  }
) => {
  return await User.updateOne(
    { _id: new Types.ObjectId(userId) },
    { summoner: summoner }
  )
}