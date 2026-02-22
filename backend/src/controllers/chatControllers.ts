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
        
        const formattedChats = chats.map(chat => {
            const otherParticipant = chat.participants.find((p: any) => p._id.toString() !== userId);
            return {
                _id: chat._id,
                participants: otherParticipant ?? null,
                lastMessage: chat.lastMessage,
                lastMessageAt: chat.lastMessageAt,
                createdAt: chat.createdAt,
            };
        });
        
        res.json(formattedChats);
    } catch (error) {
        next(error);
    }
}

export async function getOrCreateChat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const participantId = req.params.participantId as string; 

        if (!participantId) {
            return res.status(400).json({ message: "Participant ID is required" });
        }

        if (!Types.ObjectId.isValid(participantId)) {  
            return res.status(400).json({ message: "Participant ID must be a valid ObjectId" });
        }

        if (userId === participantId) {
            return res.status(400).json({ message: "Cannot create chat with yourself" });
        }

        const chat = await Chat.findOneAndUpdate(
            { participants: { $all: [userId, participantId] } },
            { 
                participants: [userId, participantId],
            },
            { 
                upsert: true, 
                new: true,
                setDefaultsOnInsert: true 
            }
        )
        .populate("participants", "name email avatar")
        .populate("lastMessage");

        const otherParticipant = chat.participants.find((p: any) => p._id.toString() !== userId);

        res.json({
            _id: chat._id,
            participants: otherParticipant ?? null,
            lastMessage: chat.lastMessage,
            lastMessageAt: chat.lastMessageAt,
            createdAt: chat.createdAt,
        });
    } catch (error) {
        next(error);
    }
}