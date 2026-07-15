//seed is a script that populates the database with fake data for testing and development purposes
//never run this script in production, this will delete all the data in the db
import {db} from "./connections.ts";
import {users, habits, entries, tags, habitTags} from "./schema.ts";
import { v4 as uuid } from "uuid";
import { pathToFileURL } from "node:url";
import {hashPassword} from "../utils/passwords.ts";

const seed = async () => {
    console.log("starting database seed...");
    try {
        console.log("clearing existing data...");
        //clearing must be in order. children first before parents
        await db.delete(entries);
        await db.delete(habitTags);
        await db.delete(habits);
        await db.delete(tags);
        await db.delete(users);

        console.log("creating fake users...");
        const demoUser = {
            id: uuid(),
            username: "SampleUser",
            email: "User67@sample.com",
            password: await hashPassword("password123"),
            firstName: "User",
            lastName: "Sample",
        };

        await db.insert(users).values(demoUser);

        console.log("creating fake tags...");
        const healthTag = {
            id: uuid(),
            name: "SampleTag",
            color: "#FF5733",
        };
        await db.insert(tags).values(healthTag);

        const exerciseHabit = {
            id: uuid(),
            userId: demoUser.id,
            name: "Sample Exercise Habit",
            description: "Daily exercise routine",
            frequency: "Daily",
            targetCount: 1,
            isActive: true,
        };
        await db.insert(habits).values(exerciseHabit);

        await db.insert(habitTags).values({
            id: uuid(),
            habitId: exerciseHabit.id,
            tagId: healthTag.id,
        });

        console.log("Adding completion entries...");
        const today = new Date();
        today.setHours(12, 0, 0, 0); 

        for(let i = 0; i < 7; i++){
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            await db.insert(entries).values({
                id: uuid(),
                habitId: exerciseHabit.id,
                completionDate: date,
                note: `Completed exercise on ${date.toDateString()}`,
            })
        }
        
        console.log("Database seeding completed successfully!");
        console.log("User informations:");
        console.log(`Username: ${demoUser.username}`);
        console.log(`Email: ${demoUser.email}`);
        console.log(`Password: ${demoUser.password}`);

    }catch (e){
        console.error("Error occurred while seeding the database:", e);
        process.exit(1);
    }
}

// process.argv[1] is the path where the script is executed.
//this prevents the script from automatic execution when imported as a module in other files.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    seed()
    .then(() => process.exit(0))
    .catch((e) => {console.error("Error occurred while seeding the database:", e); process.exit(1)});
}
export default seed;