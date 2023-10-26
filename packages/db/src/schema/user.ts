import { InferModel } from "drizzle-orm";
import { pgTable, varchar, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export type User = InferModel<typeof user>;

export const user = pgTable("user", {
	id: varchar("id", { length: 21 }).primaryKey().notNull(),
	email: varchar("email", { length: 360 }).notNull().unique(),
	password: varchar("password", { length: 72 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => {
	return {
		emailInedx: uniqueIndex("user_email_index").on(table.email)
	}
});