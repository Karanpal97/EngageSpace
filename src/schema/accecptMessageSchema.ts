import { z } from "zod";

export const isAcceptingMessage = z.object({
    accecptMessage: z.boolean(),
});
