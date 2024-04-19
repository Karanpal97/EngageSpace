import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import dbConnection from "@/lib/db.connect";

import userModel from "@/model/user";

export const authoptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "jsmith",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                try {
                    await dbConnection();
                    const user = await userModel.findOne({
                        $or: [
                            {
                                username: credentials.idetifier,
                            },
                            { username: credentials.idetifier },
                        ],
                    });
                    if (!user) {
                        throw new Error("No user find with this email");
                    }
                    if (!user.isVerified) {
                        throw new Error("plz verify your email");
                    }

                    const isPasswordCorreect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    if (isPasswordCorreect) {
                        return user;
                    } else {
                        throw new Error("incorrect password");
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.username = user.username;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.accecptMessage = token.acceptMessage;
                session.user.username = token.username;
            }

            return session;
        },
    },
    pages: {
        signIn: "/signIn",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
