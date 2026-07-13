import bycrpt from "bcrypt";
import env from "../../env.ts";

export const hashPassword = async (password: string) => {
    return await bycrpt.hash(password, env.BCRYPT_ROUNDS);
}