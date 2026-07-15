//supertest will allow us to make requests without having to run the server on a port
import request from "supertest";
import app from "../src/server.ts";
import env from "../env.ts"
import { createTestUser, createTestHabit, cleanUpDb} from "./setup/dbHelpers.ts";

describe("Authentication Endpoints", () => {
    afterEach(async () => {
        await cleanUpDb();
    })
    describe("POST /api/auth/register", () => {
        it("shoud register a new user and return a token", async () => {
            const userData = {
                email: `test-${Date.now()}-${Math.floor(Math.random() * 100)}@example.com`,
                username: `test-${Date.now()}-${Math.floor(Math.random() * 100)}`,
                firstName: "Test",
                lastName: "User",
                password: "password123"
            }
            const response = await request(app)
            .post("/api/auth/register")
            .send(userData)
            .expect(201);
            console.log(response.body);
            expect(response.body).toHaveProperty("newUser");
            expect(response.body).toHaveProperty("token");
            expect(response.body.newUser).not.toHaveProperty("password");
        })
    })
    describe("POST /api/auth/login", () => {
        it("should login an existing user and return a token", async () => {
            const testUser = await createTestUser();
            const response = await request(app).post("/api/auth/login").send({
                email: testUser.user.email,
                password: testUser.rawPassword
            }).expect(201);
            console.log(response.body);

            expect(response.body).toHaveProperty("message");
            expect(response.body).toHaveProperty("user");
            expect(response.body).toHaveProperty("token");
            expect(response.body.user).not.toHaveProperty("password");
        })
    })
})
