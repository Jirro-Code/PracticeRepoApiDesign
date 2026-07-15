import {db} from "../../src/db/connections.ts";
import { users, habits, entries, tags, habitTags, type NewUser, type NewHabit } from "../../src/db/schema.ts";
import { generateToken } from "../../src/utils/jwt.ts";
import { hashPassword } from "../../src/utils/passwords.ts";
import {v4 as uuid} from "uuid";


export const createTestUser = async (userData: Partial<NewUser> = {}) => {
    const defaultData = {
        id: uuid(),
        email: `test-${Date.now()}-${Math.floor(Math.random() * 100)}@example.com`,
        username: `test-${Date.now()}-${Math.floor(Math.random() * 100)}`,
        firstName: "Test",
        lastName: "User",
        password: await hashPassword("adminPassword123"),
        ...userData
    }
    await db.insert(users).values(defaultData);

    const token = await generateToken({
        id: defaultData.id,
        email: defaultData.email,
        username: defaultData.username
    })
    return { user: defaultData, token, rawPassword: "adminPassword123" };
}

export const createTestHabit = async (userId: string, habitData: Partial<NewHabit> = {}) => {
    const defaultHabitData = {
        id: uuid(),
        userId: userId,
        name: `Test Habit ${Date.now()}`,
        description: `Test Habit Description ${Date.now()}`,
        frequency: "Daily",
        targetCount: 5,
        ...habitData
    }
    await db.insert(habits).values(defaultHabitData)

    return defaultHabitData;
}

export const cleanUpDb = async () => {
    await db.delete(entries);
    await db.delete(habitTags);
    await db.delete(habits);
    await db.delete(tags);
    await db.delete(users);
}
