import mongoose from "mongoose";
import { ObjectId, Schema } from "../db";
import bcrypt from 'bcrypt';
import PassportLocalMongoose from 'passport-local-mongoose';
import { IUser, REGIONS } from "@fyp/types";

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, index: true , unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  summoner: {
    type: {
      name: { type: String, required: true },
      tag: { type: String, required: true },
      puuid: { type: String, required: true },
      region: { type: String, enum: REGIONS, required: true },
      profileIconId: { type: Number, required: true }
    },
    required: false
  },
  recordings: [{ type: ObjectId, required: true, ref: 'Recording' }],
  highlights: [{ type: ObjectId, required: true, ref: 'Highlight' }]
});

UserSchema.plugin(PassportLocalMongoose);

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