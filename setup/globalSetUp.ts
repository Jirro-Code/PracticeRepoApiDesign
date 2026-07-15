import {db} from '../src/db/connections.ts';
import {users, habits, entries, tags, habitTags} from '../src/db/schema.ts';
import {sql} from 'drizzle-orm';
import {execSync} from 'child_process';
import { th } from 'zod/locales';

export default async function setUp() {
    console.log("Setting up the database for testing...");
    try{
        await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`);
        
        console.log("Pushing schema using drizzle-kit...");
        execSync(`npx drizzle-kit push --url="${process.env.DATABASE_URL}" 
            --schema=".src/db/schema.ts" --dialect="mysql"`, 
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
            await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`);
            await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`);
            await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`);
            await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`);
            await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`);

            process.exit(0);
        } catch (e){
            console.error("Error during database cleanup:", e);
            throw e;
        }
    }
}