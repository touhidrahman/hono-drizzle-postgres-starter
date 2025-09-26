import { sql } from 'drizzle-orm'
import { boolean, decimal, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
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

export const accountTypeTable = pgTable('account_type', {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }),
    sortOrder: integer().default(0),
})

export const bankAccountTypeEnum = pgEnum(
    'bank_account_type',
    ['Checking', 'Savings'],
)

export const installmentFrequencyEnum = pgEnum(
    'installment_frequency',
    ['weekly', 'biweekly', 'monthly', 'quarterly', 'annually'],
)

export const recurringFrequencyEnum = pgEnum(
    'recurring_frequency',
    ['w', 'm', 'y'], // weekly, monthly, yearly
)

export const endTermTypeEnum = pgEnum(
    'end_term_type',
    ['after_occurrence', 'on_date', 'never'],
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
    type: integer().notNull().references(() => accountTypeTable.id),
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

export const spendingCardTable = pgTable('spending_card', {
    id: id(),
    accountId: text().notNull().references(() => accountTable.id),
    nameOnCard: varchar({ length: 100 }).notNull(),
    number: varchar({ length: 20 }).notNull(), // Encrypted/hashed in practice
    bankName: varchar({ length: 100 }).notNull(),
    type: varchar({ length: 50 }).notNull(), // e.g., Visa, MasterCard
    category: varchar({ length: 50 }), // e.g., Debit, Credit, Prepaid
    expirationDate: varchar({ length: 5 }), // MM/YY
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
    categoryId: text().notNull().references(() => categoryTable.id),
    subcategoryId: text().notNull().references(() => subcategoryTable.id),
    recurringTransactionTemplateId: text().references(() => recurringTransactionTemplateTable.id),
    description: varchar({ length: 500 }),
    transactionCurrency: varchar({ length: 3 }).notNull(), // ISO 4217 currency codes
    currencyConversionRate: decimal({ precision: 10, scale: 6 }).notNull().default('1.000000'),
    currency: varchar({ length: 3 }).notNull(), // Base currency
    ...timestampColumns,
})

export const carLoanTable = pgTable('car_loan', {
    id: id(),
    name: varchar({ length: 100 }).notNull(),
    make: varchar({ length: 50 }).notNull(),
    model: varchar({ length: 50 }).notNull(),
    year: integer().notNull(),
    financeInstitution: varchar({ length: 100 }),
    financeAmount: decimal({ precision: 15, scale: 2 }),
    apr: decimal({ precision: 5, scale: 3 }), // e.g., 4.500 for 4.5%
    installmentsRequired: integer(),
    installmentsDone: integer().default(0),
    upcomingInstallmentNumber: integer(),
    paymentDate: integer(), // day of month (1-31)
    installmentAmount: decimal({ precision: 15, scale: 2 }),
    installmentFrequency: installmentFrequencyEnum(),
    ...timestampColumns,
})

export const mortgageTable = pgTable('mortgage', {
    id: id(),
    name: varchar({ length: 100 }).notNull(),
    address: varchar({ length: 200 }).notNull(),
    address2: varchar({ length: 200 }),
    city: varchar({ length: 100 }).notNull(),
    zip: varchar({ length: 20 }).notNull(),
    state: varchar({ length: 50 }).notNull(),
    financeInstitute: varchar({ length: 100 }),
    financeAmount: decimal({ precision: 15, scale: 2 }),
    downPaymentAmount: decimal({ precision: 15, scale: 2 }),
    installmentsRequired: integer(),
    installmentsDone: integer().default(0),
    upcomingInstallmentNumber: integer(),
    closingCosts: decimal({ precision: 15, scale: 2 }),
    installmentAmount: decimal({ precision: 15, scale: 2 }),
    installmentFrequency: installmentFrequencyEnum(),
    ...timestampColumns,
})

export const categoryTable = pgTable('category', {
    id: id(),
    name: varchar({ length: 100 }).notNull(),
    icon: varchar({ length: 50 }),
    description: varchar({ length: 500 }),
    color: varchar({ length: 7 }), // Hex color code like #FF5733
    ...timestampColumns,
})

export const subcategoryTable = pgTable('subcategory', {
    id: id(),
    parentId: text().notNull().references(() => categoryTable.id),
    name: varchar({ length: 100 }).notNull(),
    icon: varchar({ length: 50 }),
    description: varchar({ length: 500 }),
    ...timestampColumns,
})

export const recurringTransactionTemplateTable = pgTable('recurring_transaction_template', {
    id: id(),
    name: varchar({ length: 100 }).notNull(),
    txnCurrency: varchar({ length: 3 }).notNull(), // ISO 4217 currency codes
    txnAmount: decimal({ precision: 15, scale: 4 }).notNull(),
    frequency: recurringFrequencyEnum().notNull(),
    executeOn: integer().notNull().default(1), // day of month (1-31) for monthly, day of year (1-365) for yearly, 1-7 for weekly (1=Sunday)
    endTerm: endTermTypeEnum().notNull(),
    occurrenceCount: integer(), // required if endTerm is 'after_occurrence'
    endDate: timestamp({ withTimezone: true }), // required if endTerm is 'on_date'
    occurredCount: integer().notNull().default(0),
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

export type SpendingCard = typeof spendingCardTable.$inferSelect
export type NewSpendingCard = typeof spendingCardTable.$inferInsert

export type Transaction = typeof transactionTable.$inferSelect
export type NewTransaction = typeof transactionTable.$inferInsert

export type CarLoan = typeof carLoanTable.$inferSelect
export type NewCarLoan = typeof carLoanTable.$inferInsert

export type Mortgage = typeof mortgageTable.$inferSelect
export type NewMortgage = typeof mortgageTable.$inferInsert

export type Category = typeof categoryTable.$inferSelect
export type NewCategory = typeof categoryTable.$inferInsert

export type Subcategory = typeof subcategoryTable.$inferSelect
export type NewSubcategory = typeof subcategoryTable.$inferInsert

export type RecurringTransactionTemplate = typeof recurringTransactionTemplateTable.$inferSelect
export type NewRecurringTransactionTemplate = typeof recurringTransactionTemplateTable.$inferInsert
