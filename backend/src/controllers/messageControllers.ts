import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Message } from "../models/Message";
import { Chat } from "../models/Chat";



export async function getMesseges(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const { chatId } = req.params;
        const chat = await Chat.findById({
            _id: chatId,
            participants: userId

        });
        if (!chat) {
            res.status(404).json({ message: "Chat not found" });
            return;
        }
        const messages = await Message.find({ chat: chatId })
        .populate("sender", "name email")
        .sort({ createdAt: 1 });
        res.json(messages);


    } catch (error) {
        res.status(500);
        next(error);
    }
}