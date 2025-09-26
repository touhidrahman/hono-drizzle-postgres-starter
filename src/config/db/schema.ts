import { relations, sql } from 'drizzle-orm'
import {
    boolean,
    decimal,
    integer,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core'
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

export const frequencyEnum = pgEnum('frequency', ['week', 'month', 'year'])

export const transactionTypeEnum = pgEnum('transaction_type', [
    'income',
    'expense',
])

export const accountTypeTable = pgTable('account_type', {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }),
    sortOrder: integer().default(0),
})

export const recurringFrequencyTable = pgTable('recurring_frequency', {
    id: serial().primaryKey(),
    name: varchar({ length: 50 }).notNull(),
    description: varchar({ length: 255 }),
    sortOrder: integer().default(0),
})

export const endTermTypeEnum = pgEnum('end_term_type', [
    'after_occurrence',
    'on_date',
    'never',
])

export const budgetTemplateTable = pgTable('budget_template', {
    id: id(),
    name: varchar({ length: 100 }).notNull(),
    frequency: frequencyEnum().notNull(),
    maxBudget: decimal({ precision: 10, scale: 2 }).notNull(),
    ...timestampColumns,
})

export const budgetPeriodTable = pgTable('budget_period', {
    id: id(),
    budgetTemplateId: text()
        .notNull()
        .references(() => budgetTemplateTable.id),
    startDate: timestamp({ withTimezone: true }).notNull(),
    endDate: timestamp({ withTimezone: true }).notNull(),
    realizedAmount: decimal({ precision: 10, scale: 2 })
        .notNull()
        .default('0.00'),
    ...timestampColumns,
})

export const accountTable = pgTable('account', {
    id: id(),
    name: varchar({ length: 100 }).notNull(),
    balance: decimal({ precision: 15, scale: 2 }).notNull().default('0.00'),
    description: varchar({ length: 500 }),
    type: integer()
        .notNull()
        .references(() => accountTypeTable.id),
    ...timestampColumns,
})

export const bankAccountTable = pgTable('bank_account', {
    id: id(),
    accountId: text()
        .notNull()
        .references(() => accountTable.id),
    accountName: varchar({ length: 100 }).notNull(),
    accountNumber: varchar({ length: 50 }).notNull(),
    bankName: varchar({ length: 100 }).notNull(),
    branchName: varchar({ length: 100 }),
    routingNumber: varchar({ length: 20 }),
    ibanNumber: varchar({ length: 34 }),
    type: text(), // e.g., Checking, Savings
    currency: varchar({ length: 3 }).notNull(), // ISO 4217 currency codes
    active: boolean().notNull().default(true),
    ...timestampColumns,
})

export const spendingCardTable = pgTable('spending_card', {
    id: id(),
    accountId: text()
        .notNull()
        .references(() => accountTable.id),
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
    currency: varchar({ length: 3 }).notNull(), // ISO 4217 currency codes
    active: boolean().notNull().default(true),
    ...timestampColumns,
})

export const transactionTable = pgTable('transaction', {
    id: id(),
    accountId: text()
        .notNull()
        .references(() => accountTable.id),
    budgetId: text().references(() => budgetPeriodTable.id),
    transactionAmount: decimal({ precision: 15, scale: 4 }).notNull(),
    finalAmount: decimal({ precision: 15, scale: 4 }).notNull(),
    type: transactionTypeEnum().notNull(),
    categoryId: text()
        .notNull()
        .references(() => categoryTable.id),
    subcategoryId: text()
        .notNull()
        .references(() => subcategoryTable.id),
    recurringTransactionTemplateId: text().references(
        () => recurringTransactionTemplateTable.id,
    ),
    description: varchar({ length: 500 }),
    transactionCurrency: varchar({ length: 3 }).notNull(), // ISO 4217 currency codes
    currencyConversionRate: decimal({ precision: 10, scale: 6 })
        .notNull()
        .default('1.000000'),
    currency: varchar({ length: 3 }).notNull(),
    ...timestampColumns,
})

export const carLoanTable = pgTable('car_loan', {
    id: id(),
    accountId: text()
        .notNull()
        .references(() => accountTable.id),
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
    installmentFrequency: integer()
        .notNull()
        .references(() => recurringFrequencyTable.id),
    ...timestampColumns,
})

export const mortgageTable = pgTable('mortgage', {
    id: id(),
    accountId: text()
        .notNull()
        .references(() => accountTable.id),
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
    installmentFrequency: integer()
        .notNull()
        .references(() => recurringFrequencyTable.id),
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
    parentId: text()
        .notNull()
        .references(() => categoryTable.id),
    name: varchar({ length: 100 }).notNull(),
    icon: varchar({ length: 50 }),
    description: varchar({ length: 500 }),
    ...timestampColumns,
})

export const recurringTransactionTemplateTable = pgTable(
    'recurring_transaction_template',
    {
        id: id(),
        name: varchar({ length: 100 }).notNull(),
        type: transactionTypeEnum().notNull(),
        txnCurrency: varchar({ length: 3 }).notNull(), // ISO 4217 currency codes
        txnAmount: decimal({ precision: 15, scale: 4 }).notNull(),
        frequency: integer()
            .notNull()
            .references(() => recurringFrequencyTable.id),
        occuranceGap: integer().notNull().default(1), // e.g., every 2 weeks, every 3 months
        executeOn: integer().notNull().default(1), // day of month (1-31) for monthly, day of year (1-365) for yearly, 1-7 for weekly (1=Sunday)
        endTerm: endTermTypeEnum().notNull(),
        occurrenceCount: integer(), // required if endTerm is 'after_occurrence'
        endDate: timestamp({ withTimezone: true }), // required if endTerm is 'on_date'
        occurredCount: integer().notNull().default(0),
        ...timestampColumns,
    },
)

// Relations
export const budgetTemplateRelations = relations(
    budgetTemplateTable,
    ({ many }) => ({
        budgetPeriods: many(budgetPeriodTable),
    }),
)

export const budgetPeriodRelations = relations(
    budgetPeriodTable,
    ({ one, many }) => ({
        budgetTemplate: one(budgetTemplateTable, {
            fields: [budgetPeriodTable.budgetTemplateId],
            references: [budgetTemplateTable.id],
        }),
        transactions: many(transactionTable),
    }),
)

export const accountTypeRelations = relations(accountTypeTable, ({ many }) => ({
    accounts: many(accountTable),
}))

export const accountRelations = relations(accountTable, ({ one, many }) => ({
    accountType: one(accountTypeTable, {
        fields: [accountTable.type],
        references: [accountTypeTable.id],
    }),
    bankAccounts: many(bankAccountTable),
    spendingCards: many(spendingCardTable),
    transactions: many(transactionTable),
    carLoans: many(carLoanTable),
    mortgages: many(mortgageTable),
}))

export const bankAccountRelations = relations(bankAccountTable, ({ one }) => ({
    account: one(accountTable, {
        fields: [bankAccountTable.accountId],
        references: [accountTable.id],
    }),
}))

export const spendingCardRelations = relations(
    spendingCardTable,
    ({ one }) => ({
        account: one(accountTable, {
            fields: [spendingCardTable.accountId],
            references: [accountTable.id],
        }),
    }),
)

export const carLoanRelations = relations(carLoanTable, ({ one }) => ({
    account: one(accountTable, {
        fields: [carLoanTable.accountId],
        references: [accountTable.id],
    }),
    installmentFrequency: one(recurringFrequencyTable, {
        fields: [carLoanTable.installmentFrequency],
        references: [recurringFrequencyTable.id],
    }),
}))

export const mortgageRelations = relations(mortgageTable, ({ one }) => ({
    account: one(accountTable, {
        fields: [mortgageTable.accountId],
        references: [accountTable.id],
    }),
    installmentFrequency: one(recurringFrequencyTable, {
        fields: [mortgageTable.installmentFrequency],
        references: [recurringFrequencyTable.id],
    }),
}))

export const categoryRelations = relations(categoryTable, ({ many }) => ({
    subcategories: many(subcategoryTable),
    transactions: many(transactionTable),
}))

export const subcategoryRelations = relations(
    subcategoryTable,
    ({ one, many }) => ({
        category: one(categoryTable, {
            fields: [subcategoryTable.parentId],
            references: [categoryTable.id],
        }),
        transactions: many(transactionTable),
    }),
)

export const recurringFrequencyRelations = relations(
    recurringFrequencyTable,
    ({ many }) => ({
        carLoans: many(carLoanTable),
        mortgages: many(mortgageTable),
        recurringTransactionTemplates: many(recurringTransactionTemplateTable),
    }),
)

export const recurringTransactionTemplateRelations = relations(
    recurringTransactionTemplateTable,
    ({ one, many }) => ({
        frequency: one(recurringFrequencyTable, {
            fields: [recurringTransactionTemplateTable.frequency],
            references: [recurringFrequencyTable.id],
        }),
        transactions: many(transactionTable),
    }),
)

export const transactionRelations = relations(transactionTable, ({ one }) => ({
    account: one(accountTable, {
        fields: [transactionTable.accountId],
        references: [accountTable.id],
    }),
    budgetPeriod: one(budgetPeriodTable, {
        fields: [transactionTable.budgetId],
        references: [budgetPeriodTable.id],
    }),
    category: one(categoryTable, {
        fields: [transactionTable.categoryId],
        references: [categoryTable.id],
    }),
    subcategory: one(subcategoryTable, {
        fields: [transactionTable.subcategoryId],
        references: [subcategoryTable.id],
    }),
    recurringTemplate: one(recurringTransactionTemplateTable, {
        fields: [transactionTable.recurringTransactionTemplateId],
        references: [recurringTransactionTemplateTable.id],
    }),
}))

export type User = typeof usersTable.$inferSelect
export type NewUser = typeof usersTable.$inferInsert

export type BudgetTemplate = typeof budgetTemplateTable.$inferSelect
export type NewBudgetTemplate = typeof budgetTemplateTable.$inferInsert

export type BudgetPeriod = typeof budgetPeriodTable.$inferSelect
export type NewBudgetPeriod = typeof budgetPeriodTable.$inferInsert

export type Account = typeof accountTable.$inferSelect
export type NewAccount = typeof accountTable.$inferInsert

export type AccountType = typeof accountTypeTable.$inferSelect
export type NewAccountType = typeof accountTypeTable.$inferInsert

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

export type RecurringTransactionTemplate =
    typeof recurringTransactionTemplateTable.$inferSelect
export type NewRecurringTransactionTemplate =
    typeof recurringTransactionTemplateTable.$inferInsert

export type RecurringFrequency = typeof recurringFrequencyTable.$inferSelect
export type NewRecurringFrequency = typeof recurringFrequencyTable.$inferInsert
