import { sql } from "drizzle-orm";
import { db } from "../db"

export const setCurrentUser = async(userId: string) => await db.execute(sql`SET db.user_id = '${sql.raw(userId)}';`);