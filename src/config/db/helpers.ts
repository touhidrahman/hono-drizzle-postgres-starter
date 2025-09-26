import { sql } from 'drizzle-orm'
import { text, timestamp } from 'drizzle-orm/pg-core'
import { generateId } from '../../util/id-util'

export const timestampColumns = {
    createdAt: timestamp({ withTimezone: true }).defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    deletedAt: timestamp({ withTimezone: true }).default(sql`NULL`),
}

export const id = () => {
    return text().unique().primaryKey().$defaultFn(generateId)
}
