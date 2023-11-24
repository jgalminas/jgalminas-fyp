import { db } from "../db";
import { IMatch } from "../schema";
import { Frame } from "../schema/frame";
import { Match } from "../schema/match";

export const insertMatch = async(data: IMatch) => {

  const session = await (await db).startSession();
  session.startTransaction();

  let match;

  try {
    const frames = await Frame.insertMany(data.frames, { session });
    // data.frames = frames;
    match = await Match.create(data, { session });
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
  }

  return match;
} 