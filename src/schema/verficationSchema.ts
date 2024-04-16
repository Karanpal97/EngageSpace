import { z } from "zod";

export const verificationSchema = z.object({
    code: z.string().length(6, "the maximum of the 6 digit code is required"),
});
