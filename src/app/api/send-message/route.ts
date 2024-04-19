import dbConnection from "@/lib/db.connect";
import userModel from "@/model/user";
import { Message } from "@/model/user";

export async function POST(request: Request) {
    await dbConnection();
    const { name, content } = await request.json();
    try {
        const user = await userModel.findOne({ name });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "the user with user name not found",
                },
                { status: 404 }
            );
        }
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "the user is not accepting the message",
                },
                { status: 403 }
            );
        }
        const newMessage = { content, createdAt: new Date() };
        user.message.push(newMessage as Message);
        user.save();
        return Response.json(
            {
                success: true,
                message: "successfully sended the message",
            },
            { status: 201 }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "there is issue in sending the message",
                error: error,
            },
            { status: 500 }
        );
    }
}
