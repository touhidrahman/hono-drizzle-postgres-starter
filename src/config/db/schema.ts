import {integer, pgTable, varchar} from "drizzle-orm/pg-core";
import {uuid} from "drizzle-orm/pg-core/columns/uuid";
import {sql} from "drizzle-orm";

export const usersTable = pgTable("users", {
    id: uuid().unique().primaryKey().default(sql`uuid_generate_v4
    ()`),
    name: varchar({length: 100}).notNull(),
    email: varchar({length: 100}).notNull().unique(),
    password: varchar({length: 255}).notNull(),
    emailVerified: integer().notNull().default(0),
});

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;