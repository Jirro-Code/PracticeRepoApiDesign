import type {Request, Response, NextFunction} from "express";
import {verifyToken, type JwtPayload} from "../utils/jwt.ts";

//checks if the request has a valid JWT token
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try{
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if(!token){
            return res.status(401).json({error: "No token provided"});
        }

        const payload = await verifyToken(token);
        req.user = payload;
        console.log("Authenticated user:", req.user);
        next();
    }catch (e){
        return res.status(403).json({error: "Forbidden"});
    }
}