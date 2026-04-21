export async function getUsers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    console.log("✅ getUsers HIT");

    const userId = req.userId;
    console.log("👉 req.userId:", userId);

    const users = await User.find({ _id: { $ne: userId } })
      .select("name email avatar")
      .limit(50);

    console.log("🔥 USERS FROM DB:", JSON.stringify(users, null, 2));

    res.json({ users });
  } catch (error) {
    console.error("❌ getUsers ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}