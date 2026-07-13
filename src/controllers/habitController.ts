import type{Response} from "express";
import type {AuthenticatedRequest} from "../middleware/auth.ts";
import {db} from "../db/connections.ts";
import { habits, entries, habitTags, tags} from "../db/schema.ts";
import { eq, and, desc, inArray} from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { z } from "zod";

export const createHabit = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const {name, description, frequency, targetCount, tagIds} = req.body;

        const result = await db.transaction(async (tx) => {
            const newHabit = {
                id: uuid(),
                userId: req.user!.id,
                name,
                description,
                frequency,
                targetCount
            }
            await tx.insert(habits).values(newHabit);

            if(tagIds && tagIds.length > 0){
                const habitTagValues  = tagIds.map((tagId: string) => ({
                    id: uuid(),
                    habitId: newHabit.id,
                    tagId
                }))

                await tx.insert(habitTags).values(habitTagValues);
            }

            return newHabit;
        })

        res.status(201).json({message: "Habit created successfully", habit: result});
    } catch(e){
        res.status(500).json({message: "Error creating habit"});
    }
}