import {Router} from "express";
import { protecRoute } from "../middleware/auth";
import { authCallback, getMe } from "../controllers/authControllers";

const router = Router();

router.get("/me", protecRoute, getMe);
router.post("/callback", authCallback)

export default router;