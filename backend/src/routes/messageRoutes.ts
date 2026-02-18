import {Router} from "express";
import { protecRoute } from "../middleware/auth";
import { getMesseges } from "../controllers/messageControllers";

const router = Router();

router.get("/chat/:chatId", protecRoute, getMesseges )
export default router;