import { z } from "zod";

export const userValidation = z
    .string()
    .min(2, "the minimum two charcter is required")
    .max(20, "maximum 20 charcter is allowed");

export const signUpValidation = z.object({
    username: userValidation,
    email: z.string().email({ message: "invalid email type" }),
    password: z
        .string()
        .min(6, { message: "the minimum 6 number is required" })
        .max(20, { message: "the maximum 20 number is required " }),
});
