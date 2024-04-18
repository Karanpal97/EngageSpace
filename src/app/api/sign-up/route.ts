import dbConnection from "@/lib/db.connect";

import { sendVerification } from "@/helpers/verification";
import userModel from "@/model/user";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    await dbConnection();
    try {
        const { name, email, password } = await request.json();

        const existingVerifiedUserByname = await userModel.findOne({
            name,
            isVerified: true,
        });

        if (existingVerifiedUserByname) {
            return Response.json(
                {
                    success: false,
                    message: "name is already taken",
                },
                { status: 400 }
            );
        }

        const existingUserByEmail = await userModel.findOne({ email });
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email",
                    },
                    { status: 400 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyExpiry = new Date(
                    Date.now() + 3600000
                );
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new userModel({
                name,
                email,
                password: hashedPassword,
                verifyCode,
                verifyExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });

            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendVerification(email, name, verifyCode);
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message:
                    "User registered successfully. Please verify your account.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering user:", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            { status: 500 }
        );
    }
}
