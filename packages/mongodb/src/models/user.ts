import mongoose, { Document } from "mongoose";
import { Schema } from "../db";
import bcrypt from 'bcrypt';

export type IUser = {
  email: string,
  password: string
} & Document

const UserSchema = new Schema({
  email: { type: String, required: true, index: true },
  password: { type: String, required: true }
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