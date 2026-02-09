import e from "express";
import mongoose, { Schema, type Document } from "mongoose";
import { transpileModule } from "typescript";

export interface IUser extends Document {
    clerkId: string;
    name: string;
    email: string;
    avatar?: string;
    createAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    avatar: { type: String, default: "" }
}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);
