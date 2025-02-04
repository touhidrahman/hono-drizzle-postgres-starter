import {faker} from "@faker-js/faker";
import {db} from "./index";
import * as schema from "./schema";
import {reset} from "drizzle-seed";
import {usersTable} from "./schema";
import {password} from "bun";

async function seed() {
    console.log("🔄 Seeding users...");

    await reset(db, schema);

    const users = Array.from({length: 10}, () => ({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: password.hashSync("admin11", "bcrypt"),
        emailVerified: faker.date.recent(),
        role: "USER",
    }));

    users.push({
        name: "Admin",
        email: "admin@gmail.com",
        password: password.hashSync("admin11", "bcrypt"),
        emailVerified: faker.date.recent(),
        role: "ADMIN",
    });

    await db.insert(usersTable).values(users);

    console.log("✅ Seeding completed");
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});