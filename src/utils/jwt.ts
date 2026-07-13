//JWT is used to make fetching more reliable and secure
//with JWT you don't need to fetch all of your data to the server
//instead you can just send the JWT to the server and the server can verify the JWT and get the user data from ittttttttttttttttttt

import  {type JWTPayload, jwtVerify, SignJWT} from "jose";
import {createSecretKey} from "crypto"
import env from "../../env.ts";

export interface JwtPayload extends JWTPayload {
    id: string;
    username: string;
    email: string;
}

export const generateToken = async (payload: JwtPayload) => {
    const secret = env.JWT_SECRET;
    const secretKey = createSecretKey(secret, "utf-8");

    return new SignJWT(payload)
    .setProtectedHeader({alg: "HS256"})
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN || "3d")
    .sign(secretKey);
}

export const verifyToken = async (token: string): Promise<JwtPayload> =>{
    const secretKey = createSecretKey(env.JWT_SECRET, "utf-8");
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as JwtPayload;
}