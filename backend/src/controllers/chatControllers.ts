import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Chat } from "../models/Chat";
import { Types } from "mongoose";

export async function getChats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;

        const chats = await Chat.find({ participants: userId })
            .populate("participants", "name email avatar")
            .populate("lastMessage")
            .sort({ lastMessageAt: -1 });

        const formattedChats = chats.map((chat) => {
            const otherParticipant = chat.participants.find((p: any) => p._id.toString() !== userId);

            return {
                _id: chat._id,
                participant: otherParticipant ?? null,
                lastMessage: chat.lastMessage,
                lastMessageAt: chat.lastMessageAt,
                createdAt: chat.createdAt,
            };
        });

        res.json(formattedChats);
   } catch (error) {
        console.error("❌ getOrCreateChat error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getOrCreateChat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const participantId = req.params.participantId as string;

        if (!participantId) {
            res.status(400).json({ message: "Participant ID is required" });
            return;
        }

        if (!Types.ObjectId.isValid(participantId)) {
            res.status(400).json({ message: "Invalid participant ID" });
            return;
        }

        if (userId === participantId) {
            res.status(400).json({ message: "Cannot create chat with yourself" });
            return;
        }

        let chat = await Chat.findOne({
            participants: { $all: [userId, participantId] },
        })
            .populate("participants", "name email avatar")
            .populate("lastMessage");

        if (!chat) {
            const newChat = new Chat({ participants: [userId, participantId] });
            await newChat.save();
            chat = await Chat.findById(newChat._id)
                .populate("participants", "name email avatar")
                .populate("lastMessage");
        }

        if (!chat) {
            res.status(500).json({ message: "Chat could not be created" });
            return;
        }

        const otherParticipant = (chat.participants as any[]).find(
            (p: any) => p._id.toString() !== userId
        );

        res.json({
            _id: chat._id,
            participant: otherParticipant ?? null,
            lastMessage: chat.lastMessage ?? null,
            lastMessageAt: chat.lastMessageAt ?? null,
            createdAt: chat.createdAt,
        });
    } catch (error) {
        console.error("❌ getOrCreateChat error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}