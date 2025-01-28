import {integer, pgTable, varchar} from "drizzle-orm/pg-core";
import {uuid} from "drizzle-orm/pg-core/columns/uuid";

export const usersTable = pgTable("users", {
    id: uuid().unique().primaryKey(),
    name: varchar({length: 100}).notNull(),
    email: varchar({length: 100}).notNull().unique(),
    password: varchar({length: 255}).notNull(),
});
