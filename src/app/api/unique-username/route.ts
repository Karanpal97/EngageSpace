import dbConnection from "@/lib/db.connect";
import userModel from "@/model/user";
import { z } from "zod";
import { userValidation } from "../../../schema/signupSchema";

const UserNameQuerySchema = z.object({
    name: userValidation,
});

export async function GET(request: Request) {
    dbConnection();

    try {
        const { searchParams } = new URL(request.url);
        const queryParams = { name: searchParams.get("name") };
        const result = UserNameQuerySchema.safeParse(queryParams);
        if (!result.success) {
            const userNameError = result.error.format().name?._errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                        userNameError?.length > 0
                            ? userNameError.join(",")
                            : "invalid query params",
                },
                {
                    status: 400,
                }
            );
        }

        const { name } = result.data;

        const exisitUer = await userModel.findOne({
            name,
            isVerified: true,
        });
        console.log(exisitUer, "the data is");

        if (exisitUer) {
            return Response.json(
                {
                    success: false,
                    message: "the user is already taken",
                },
                {
                    status: 405,
                }
            );
        }
        return Response.json(
            {
                success: true,
                message: "Username is unique",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error checking username:", error);
        return Response.json(
            {
                success: false,
                message: "Error checking username",
            },
            { status: 500 }
        );
    }
}
