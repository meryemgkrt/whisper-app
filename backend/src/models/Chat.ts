import mongoose, { Schema, type Document } from "mongoose";

export interface IChat extends Document {
    participants: mongoose.Types.ObjectId[];  
    lastMessage?: mongoose.Types.ObjectId;
    lastMessageAt?: Date;  
    createdAt: Date;
    updatedAt: Date;
}

const ChatSchema: Schema = new Schema<IChat>({
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],  // ✅ participants
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message", default: null },
    lastMessageAt: { type: Date, default: null }  
}, { timestamps: true });

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);  