import { sql } from 'drizzle-orm'
import { boolean, decimal, integer, pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
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

export const frequencyEnum = pgEnum(
    'frequency',
    ['week', 'month', 'year'],
)

export const transactionTypeEnum = pgEnum(
    'transaction_type',
    ['income', 'expense'],
)

export const accountTypeEnum = pgEnum(
    'account_type',
    ['Savings', 'Checking', 'Credit'],
)

export const bankAccountTypeEnum = pgEnum(
    'bank_account_type',
    ['Checking', 'Savings'],
)

export const budgetTemplateTable = pgTable('budget_template', {
    id: id(),
    name: varchar({ length: 100 }).notNull(),
    frequency: frequencyEnum().notNull(),
    maxBudget: decimal({ precision: 10, scale: 2 }).notNull(),
    ...timestampColumns,
})

export const budgetPeriodTable = pgTable('budget_period', {
    id: id(),
    budgetTemplateId: text().notNull().references(() => budgetTemplateTable.id),
    startDate: timestamp({ withTimezone: true }).notNull(),
    endDate: timestamp({ withTimezone: true }).notNull(),
    realizedAmount: decimal({ precision: 10, scale: 2 }).notNull().default('0.00'),
    ...timestampColumns,
})

export const accountTable = pgTable('account', {
    id: id(),
    name: varchar({ length: 100 }).notNull(),
    balance: decimal({ precision: 15, scale: 2 }).notNull().default('0.00'),
    description: varchar({ length: 500 }),
    type: accountTypeEnum().notNull(),
    ...timestampColumns,
})

export const bankAccountTable = pgTable('bank_account', {
    id: id(),
    accountId: text().notNull().references(() => accountTable.id),
    accountName: varchar({ length: 100 }).notNull(),
    accountNumber: varchar({ length: 50 }).notNull(),
    bankName: varchar({ length: 100 }).notNull(),
    branchName: varchar({ length: 100 }),
    routingNumber: varchar({ length: 20 }),
    ibanNumber: varchar({ length: 34 }),
    type: bankAccountTypeEnum().notNull(),
    active: boolean().notNull().default(true),
    ...timestampColumns,
})

export const creditCardTable = pgTable('credit_card', {
    id: id(),
    accountId: text().notNull().references(() => accountTable.id),
    nameOnCard: varchar({ length: 100 }).notNull(),
    number: varchar({ length: 20 }).notNull(), // Encrypted/hashed in practice
    bankName: varchar({ length: 100 }).notNull(),
    // cvc: varchar({ length: 4 }).notNull(), // Encrypted/hashed in practice
    // pin: varchar({ length: 10 }).notNull(), // Encrypted/hashed in practice
    statementDate: integer().notNull(), // day of month (1-31)
    paymentDate: integer().notNull(), // day of month (1-31)
    limit: decimal({ precision: 15, scale: 2 }).notNull(),
    balance: decimal({ precision: 15, scale: 2 }).notNull().default('0.00'),
    ...timestampColumns,
})

export const transactionTable = pgTable('transaction', {
    id: id(),
    accountId: text().notNull().references(() => accountTable.id),
    budgetId: text().references(() => budgetPeriodTable.id),
    transactionAmount: decimal({ precision: 15, scale: 4 }).notNull(),
    finalAmount: decimal({ precision: 15, scale: 4 }).notNull(),
    type: transactionTypeEnum().notNull(),
    categoryId: text(),
    subcategoryId: text(),
    description: varchar({ length: 500 }),
    transactionCurrency: varchar({ length: 3 }).notNull(), // ISO 4217 currency codes
    currencyConversionRate: decimal({ precision: 10, scale: 6 }).notNull().default('1.000000'),
    currency: varchar({ length: 3 }).notNull(), // Base currency
    ...timestampColumns,
})

export type User = typeof usersTable.$inferSelect
export type NewUser = typeof usersTable.$inferInsert

export type BudgetTemplate = typeof budgetTemplateTable.$inferSelect
export type NewBudgetTemplate = typeof budgetTemplateTable.$inferInsert

export type BudgetPeriod = typeof budgetPeriodTable.$inferSelect
export type NewBudgetPeriod = typeof budgetPeriodTable.$inferInsert

export type Account = typeof accountTable.$inferSelect
export type NewAccount = typeof accountTable.$inferInsert

export type BankAccount = typeof bankAccountTable.$inferSelect
export type NewBankAccount = typeof bankAccountTable.$inferInsert

export type CreditCard = typeof creditCardTable.$inferSelect
export type NewCreditCard = typeof creditCardTable.$inferInsert

export type Transaction = typeof transactionTable.$inferSelect
export type NewTransaction = typeof transactionTable.$inferInsert
