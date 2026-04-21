import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth";
import { User } from "../models/User";

export async function getUsers(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("✅ getUsers hit");

    const userId = req.userId;
    console.log("👉 req.userId:", userId);

    const users = await User.find({ _id: { $ne: userId } })
      .select("name email avatar")
      .limit(50);

    console.log("🔥 USERS FROM DB:", JSON.stringify(users, null, 2));

    return res.json({ users });
  } catch (error) {
    console.error("❌ getUsers error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}