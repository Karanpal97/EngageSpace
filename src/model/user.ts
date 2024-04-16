import mongoose, { Schema, Document } from "mongoose";
import { boolean } from "zod";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyExpiry: Date;
    isAcceptingMessage: boolean;
    isVerified: boolean;
    message: Message[];
}

const userSchema: Schema<User> = new Schema({
    name: {
        type: String,
        required: [true, "the field is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "the email is required "],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "the passworrd is required field"],
    },
    verifyCode: {
        type: String,
        required: [true, "this filed is also required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verifyExpiry: {
        type: Date,
        required: [true, "this field is required"],
    },
    isAcceptingMessage: {
        type: Boolean,
        required: [true, "this field is also required"],
        default: true,
    },
    message: [MessageSchema],
});

const userModel =
    (mongoose.models.User as mongoose.Model<User>) ||
    mongoose.model<User>("User", userSchema);

export default userModel;
