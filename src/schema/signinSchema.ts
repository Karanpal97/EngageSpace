import { z } from "zod";

export const signIn = z.object({
    idetifier: z.string(),
    password: z.string(),
});
