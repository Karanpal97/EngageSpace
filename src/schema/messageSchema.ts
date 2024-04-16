import { z } from "zod";

export const message = z.object({
    content: z
        .string()
        .min(6, "mimimum of 6 charchter is required")
        .max(200, "the maximum f 200 char"),
});
