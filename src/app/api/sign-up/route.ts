import dbConnection from "@/lib/db.connect";

import { sendVerification } from "@/helpers/verification";
import userModel from "@/model/user";
import bcrypt from "bcrypt";
import { ApiResponce } from "@/types/apiResponse";

export async function POST(request: Request): Promise<ApiResponce> {
    await dbConnection();
    try {
        const { username, email, password } = await request.json();

        const existVerifiedUser = await userModel.findOne({
            username,
            isVerified: true,
        });
        if (existVerifiedUser) {
            return {
                success: false,
                message: "already the give userName is taken",
                status: 500,
            };
        }
        const existUser = await userModel.findOne({
            email,
        });
        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        if (existUser) {
            if (existUser.isVerified) {
                return {
                    success: false,
                    message:
                        "the given email is registered plz take other email",
                    status: 400,
                };
            }
            const hashPassword = await bcrypt.hash(password, 10);
            existUser.verifyCode = verifyCode;
            existUser.password = hashPassword;
            existUser.verifyExpiry = new Date(Date.now() + 3600000);
            await existUser.save();
        } else {
            const hashPassword = bcrypt.hash(password, 10);

            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getHours() + 1);

            const newuser = new userModel({
                username,
                email,
                password: hashPassword,
                verifyCode: verifyCode,
                verifyExpiry: expiryDate,
                isAcceptingMessage: true,
                message: [],
            });
            await newuser.save();

            const emailResponce = await sendVerification(
                email,
                username,
                verifyCode
            );
            if (!emailResponce) {
                return {
                    success: false,
                    message: "there is some issue",
                    status: 500,
                };
            }
        }
        return {
            success: true,
            message: "sucessfully registed the user plz verify ur email",
            status: 200,
        };
    } catch (error) {
        console.log("the error in the ", error);
        return {
            success: false,
            message: "there is error in the sending of error",
            status: 500,
        };
    }
}
