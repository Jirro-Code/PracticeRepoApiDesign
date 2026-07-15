import { createTestUser, createTestHabit, cleanUpDb } from "./dbHelpers.ts";

describe("Test Setup", () => {
    test("should create a test user and habit", async () => {
        const {user, token} = await createTestUser();
        
        expect(user).toBeDefined();
        await cleanUpDb();
    })
})