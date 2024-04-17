import VerificationEmail from "../../emails/sendVerificationEmail";
import { resend } from "../lib/resend";
import { ApiResponce } from "../types/apiResponse";

export async function sendVerification(
    name: string,
    email: string,
    verifyCode: string
): Promise<ApiResponce> {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "verification email",
            react: VerificationEmail({ username: name, otp: verifyCode }),
        });
        return {
            success: true,
            message: "sended the email ",
            status: 201,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "failed to send the email",
            status: 500,
        };
    }
}
