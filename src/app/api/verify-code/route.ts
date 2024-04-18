import dbConnection from "@/lib/db.connect";
import userModel from "@/model/user";

export async function POST(request: Request) {
    try {
        const { name, verifyCode } = await request.json();
        const decodedUsername = decodeURIComponent(name);
        const user = await userModel.findOne({ name: decodedUsername });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "there is no user with this name",
                },
                { status: 404 }
            );
        }
        const codeValid = user.verifyCode === verifyCode;
        const isExpiry = user.verifyExpiry > new Date();
        if (codeValid && isExpiry) {
            return Response.json(
                {
                    success: true,
                    message: "the otp is verified successfully",
                },
                {
                    status: 200,
                }
            );
        } else if (!codeValid) {
            return Response.json(
                {
                    success: false,
                    message: "the given otp is not valid",
                },
                {
                    status: 405,
                }
            );
        } else {
            return Response.json(
                {
                    success: false,
                    message: "u exceed the expiry",
                },
                {
                    status: 405,
                }
            );
        }
    } catch (error) {
        return Response.json({
            success: false,
            message: "there is error in verify the code",
        });
    }
}
