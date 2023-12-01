import mongoose, { Document } from "mongoose";
import { Schema } from "../db";
import bcrypt from 'bcrypt';

export type IUser = {
  email: string,
  username: string,
  password: string,
  createdAt: Date,
  puuid: string | undefined
} & Document

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, index: true , unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  puuid: { type: String, required: false }
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