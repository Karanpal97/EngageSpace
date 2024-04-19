import { getServerSession } from "next-auth";
import { authoptions } from "../auth/[...nextauth]/option";
import dbConnection from "@/lib/db.connect";
import userModel from "@/model/user";

export async function POST(request: Request) {
    await dbConnection();
    const session = await getServerSession(authoptions);
    const user = session?.user;
    if (!user || !session) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated",
            },
            {
                status: 401,
            }
        );
    }

    const userId = user._id;
    const { acceptMessage } = await request.json();
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage: acceptMessage,
            },
            { new: true }
        );
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message:
                        "failed to update the status of the user to accept the message ",
                },
                {
                    status: 401,
                }
            );
        }
        return Response.json(
            {
                success: true,
                message: "successfully updated the user",
                updatedUser,
            },

            {
                status: 200,
            }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message:
                    "failed to update the status of the user to accept the message ",
            },
            {
                status: 401,
            }
        );
    }
}

export async function GET(request: Request) {
    await dbConnection();
    const session = await getServerSession(authoptions);
    const user = session?.user;
    if (!user || !session) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated",
            },
            {
                status: 401,
            }
        );
    }

    const userId = user._id;
    try {
        const foundUser = await userModel.findById(userId);
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message:
                        "failed to update the status of the user to accept the message ",
                },
                {
                    status: 401,
                }
            );
        }
        return Response.json(
            {
                success: true,
                isAcceptingMessage: foundUser,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message:
                    "failed to update the status of the user to accept the message ",
            },
            {
                status: 401,
            }
        );
    }
}
