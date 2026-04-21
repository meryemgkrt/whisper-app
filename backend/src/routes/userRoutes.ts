import { Router } from "express";
import { getUsers } from "../controllers/userControllers";
import { protecRoute } from "../middleware/auth";

const router = Router();

router.get("/", protecRoute, getUsers);
router.get("/test", getUsers); // ✅ AUTH YOK - TEST İÇİN EKLE

export default router;