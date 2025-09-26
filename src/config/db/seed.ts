import { faker } from '@faker-js/faker'
import { password } from 'bun'
import { reset } from 'drizzle-seed'
import { db } from './index'
import * as schema from './schema'
import { NewAccountType, NewRecurringFrequency, usersTable } from './schema'

async function seed() {
    console.log('🔄 Seeding users...')

    await reset(db, schema)

    const users = Array.from({ length: 10 }, () => ({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: password.hashSync('Abcd1234!', 'bcrypt'),
        emailVerified: faker.date.recent(),
        role: 'USER',
    }))

    users.push({
        name: 'Admin',
        email: 'admin@admin.com',
        password: password.hashSync('Abcd1234!', 'bcrypt'),
        emailVerified: faker.date.recent(),
        role: 'ADMIN',
    })


    const accountTypes: NewAccountType[] = [
        { name: 'Checking Account', sortOrder: 1 },
        { name: 'Savings Account', sortOrder: 2 },
        { name: 'Credit Card', sortOrder: 3 },
        { name: 'Debit Card', sortOrder: 4 },
        { name: 'Cash', sortOrder: 5 },
        { name: 'Investment Account', sortOrder: 6 },
        { name: 'Loan', sortOrder: 7 },
        { name: 'Mortgage', sortOrder: 8 },
        { name: 'Gift Card', sortOrder: 9 },
        { name: 'Other', sortOrder: 10 },
    ]

    const recurringFrequencies: NewRecurringFrequency[] = [
        { name: 'Weekly', description: 'Every week', sortOrder: 1 },
        { name: 'Monthly', description: 'Every month', sortOrder: 2 },
        { name: 'Yearly', description: 'Every year', sortOrder: 3 },
    ]

    await db.insert(usersTable).values(users)
    await db.insert(schema.accountTypeTable).values(accountTypes)
    await db.insert(schema.recurringFrequencyTable).values(recurringFrequencies)

    console.log('✅ Seeding completed')
    process.exit(0)
}

seed().catch((err) => {
    console.error('❌ Seeding failed:', err)
    process.exit(1)
})
