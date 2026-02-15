import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { User } from "../models/User";
import { clerkClient, getAuth } from "@clerk/express";

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        console.error("getMe error:", error);
        next(error);
    }
}

export async function authCallback(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId: clerkId } = getAuth(req);

        if (!clerkId) {
            return res.status(400).json({ message: "No user id provided" });
        }

        const clerkUser = await clerkClient.users.getUser(clerkId);

        // ✅ ATOMIC UPSERT - Race condition önlendi
        const user = await User.findOneAndUpdate(
            { clerkId },
            {
                clerkId,
                name: clerkUser.firstName
                    ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim()
                    : clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0] || "User",  // ✅ Fallback
                email: clerkUser.emailAddresses[0]?.emailAddress,
                avatar: clerkUser.imageUrl,
            },
            {
                upsert: true,             
                new: true,                 
                setDefaultsOnInsert: true  
            }
        );

        res.json({ user });
    } catch (error) {
        console.error("authCallback error:", error);
        next(error);  
    }
}