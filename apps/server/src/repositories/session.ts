import { ISession } from "@fyp/types"
import { Session } from "../schema/session"
import { Types } from "mongoose"

export const findSessionsByUserId = async(userId: string) => {
    return await Session.aggregate<ISession>([
        {
            $match: {
                'session.passport.user': new Types.ObjectId(userId)
            }
        }
    ])
}