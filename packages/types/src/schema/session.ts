import { Types } from "mongoose"

export type ISession = {
  _id: Types.ObjectId,
  session: {
      passport: {
          user: string
      }
  }
}