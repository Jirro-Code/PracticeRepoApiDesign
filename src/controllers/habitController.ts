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

export const getUserHabits = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const userHabitsWithTags = await db.query.habits.findMany({
            where: eq(habits.userId, req.user!.id),
            //with allows to include related data from other tables in the result set
            with: {
                habitTags: {
                    with: {
                        //true means we want to include the tag data in the result if there is a tag associated with the habitTag
                        tag: true
                    }
                }
            },  
            //desc is used to sort the results in descending order based on the createdAt field of the habits table
            orderBy: [desc(habits.createdAt)]
        })
        const habitsWithTags = userHabitsWithTags.map((habit) => ({
            ...habit,
            tags: habit.habitTags.map((habitTag) => habitTag.tag),
            // Remove habitTags from the response since we only want to return the tags
            habitTags: undefined 
        }))
        res.status(200).json({message: "Habits retrieved successfully", habits: habitsWithTags});
    }catch (e){
        res.status(500).json({message: "Error retrieving habits"});
    }
}