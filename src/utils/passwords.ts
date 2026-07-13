import bycrpt from "bcrypt";
import env from "../../env.ts";

export const hashPassword = async (password: string) => {
    return await bycrpt.hash(password, env.BCRYPT_ROUNDS);
}

export const comparePassword = async (password: string, hashedPassword: string) =>{
    return bycrpt.compare(password, hashedPassword);
}