import  {type JWTPayload, SignJWT} from "jose";
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