import {drizzle} from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema.ts";
import {env, isProd} from "../../env.ts";
import {remember} from "@epic-web/remember"

const createPool = () => {
    return mysql.createPool({
        uri: env.DATABASE_URL,
    })
}

let client

if (isProd()) {
    client = createPool();
} else {
    client = remember(`db`, () => createPool());
}

export const db = drizzle(client, {schema, mode: `default`});

export default db;