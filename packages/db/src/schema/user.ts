import { InferModel } from "drizzle-orm";
import { pgTable, varchar, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export type User = InferModel<typeof user>;

export const user = pgTable("user", {
	id: varchar("id", { length: 36 }).primaryKey().notNull(),
	firstName: varchar("first_name", { length: 64 }).notNull(),
	lastName: varchar("last_name", { length: 64 }).notNull(),
	email: varchar("email", { length: 360 }).notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => {
	return {
		emailInedx: uniqueIndex("user_email_index").on(table.email)
	}
});