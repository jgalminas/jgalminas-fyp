import mongoose, { Document } from "mongoose";
import { ObjectId, Schema } from "../db";
import bcrypt from 'bcrypt';
import { IMatch } from "./index";

export type IUser = {
  email: string,
  username: string,
  password: string,
  createdAt: Date,
  matches: IMatch[]
} & Document

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, index: true , unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  matches: [{ type: ObjectId, ref: 'Match', required: true }]
});


// Middlewere for hashing the password whenever it is changed or a new user is created
UserSchema.pre('save', async function(next) {
  
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (err) {
    next(err as any);
  }

});

export const User = mongoose.model<IUser>('User', UserSchema);