import type { Request, Response } from "express";
import bycrypt from "bcrypt";
import {db} from "../db/connnections.ts";
import {users, type NewUser} from "../db/schema.ts";
import {generateToken} from "../utils/jwt.ts";
import {hashPassword} from "../utils/passwords.ts";

export const register = async  (req: Request<any, any, NewUser>, res: Response) => {
    try{
        const hashedPassword = await hashPassword(req.body.password);

        const newUser = {
            ...req.body,
            password: hashedPassword
        }
        await db.insert(users).values(newUser);

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