import { ISession } from "@fyp/types";
import mongoose, { Schema } from "mongoose";

const SessionSchema = new Schema<ISession>({
    session: {
        passport: {
            user: {
                type: String,
                ref: 'User',
                index: true
            }
        }
    }
}, { strict: false });

export const Session = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);