import { getServerSession } from "next-auth";
import { authoptions } from "../auth/[...nextauth]/option";
import dbConnection from "@/lib/db.connect";
import userModel from "@/model/user";
import mongoose, { mongo } from "mongoose";
import { use } from "react";

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

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await userModel.aggregate([
            { $match: { _id: userId } },
            {
                $unwind: "$message",
            },
            { $sort: { "message.createdAt": 1 } },
            { $group: { _id: "$_id", message: { $push: "$message" } } },
        ]);
        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "user not found",
                },
                {
                    status: 401,
                }
            );
        }
        return Response.json(
            {
                success: true,
                message: user[0].message, //potential error
            },
            {
                status: 401,
            }
        );
    } catch (error) {}
}
