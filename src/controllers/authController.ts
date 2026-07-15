import type { Request, Response } from "express";
import {db} from "../db/connections.ts";
import {users, type NewUser} from "../db/schema.ts";
import {generateToken} from "../utils/jwt.ts";
import {hashPassword, comparePassword} from "../utils/passwords.ts";
import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const register = async  (req: Request<any, any, NewUser>, res: Response) => {
    try{
        const hashedPassword = await hashPassword(req.body.password);
        const userData = {
            ...req.body,
            id: uuid(),
            password: hashedPassword
        }
        const {password, ...newUser} = userData;
        await db.insert(users).values(userData);

        const token = await generateToken({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        });

        res.status(201).json({ message: "User registered successfully", newUser, token });

    }catch (e){
        console.error("Error occurred while registering user:", e);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const login = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;
        const user = await db.query.users.findFirst({
            where: eq(users.email, email) 
        }); 

        if(!user){
            return res.status(401).json({error: "Invalid credentials"});
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({error: "Invalid credentials"});
        }

        const token = await generateToken({
            id: user.id,
            username: user.username,
            email: user.email
        });

        return res.json({ message: "Login successful", user, token }).status(201);
    }catch (e){
        console.error("Error occurred while logging in:", e);
        return res.status(500).json({ error: "Internal server error" });
    }
}