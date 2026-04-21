import { Router } from "express";
import { protecRoute } from "../middleware/auth";
import { getChats, getOrCreateChat } from "../controllers/chatControllers";

const router = Router();

router.use(protecRoute);

router.get("/", getChats);
router.post("/with/:participantId", getOrCreateChat);

export default router;
