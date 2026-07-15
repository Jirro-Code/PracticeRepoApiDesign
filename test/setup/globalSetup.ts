import {db} from '../../src/db/connections.ts';
import {users, habits, entries, tags, habitTags} from '../../src/db/schema.ts';
import {sql} from 'drizzle-orm';
import {execSync} from 'child_process';

export default async function setUp() {
    console.log("Setting up the database for testing...");
    try{
        const tablesToDrop = [habitTags, entries, habits, tags, users];

        for (const table of tablesToDrop) {
            await db.execute(sql`DROP TABLE IF EXISTS ${table} CASCADE`);
        }
        
        console.log("Pushing schema using drizzle-kit...");
        execSync('npx drizzle-kit push', 
            {
                stdio: 'inherit',
                cwd: process.cwd(),
            }
        );

        console.log("Database setup complete.");
    } catch (e){
        console.error("Error during database setup:", e);
        throw e;
    }

    return async () => {
        try{
            const tablesToDrop = [habitTags, entries, habits, tags, users];

            for (const table of tablesToDrop) {
                await db.execute(sql`DROP TABLE IF EXISTS ${table}`);
            }

            process.exit(0);
        } catch (e){
            console.error("Error during database cleanup:", e);
            throw e;
        }
    }
}