import { sql } from 'drizzle-orm'
import { pgEnum, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { Role } from '../../types/enum/role-enum'
import { enumToArray } from '../../util/enum-util'
import { id, timestampColumns } from './helpers'

export const roleEnum = pgEnum(
    'role',
    enumToArray(Role) as [string, ...string[]],
)

export const usersTable = pgTable('users', {
    id: id(),
    name: varchar({ length: 100 }).notNull(),
    email: varchar({ length: 100 }).notNull().unique(),
    password: varchar({ length: 255 }).default(sql`NULL`),
    role: roleEnum().default('USER').notNull(),
    emailVerifiedAt: timestamp({ withTimezone: true }).default(sql`NULL`),
    loginAt: timestamp({ withTimezone: true }).default(sql`NULL`),
    ...timestampColumns,
})

export type User = typeof usersTable.$inferSelect
export type NewUser = typeof usersTable.$inferInsert
