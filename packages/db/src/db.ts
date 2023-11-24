import mongoose from 'mongoose';
import env from './env';

export const db = mongoose.connect(env.MONGODB_CONNECTION_STRING);

export const Schema = mongoose.Schema;
export const ObjectId = Schema.ObjectId;