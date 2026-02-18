import {Router} from "express";
import { getUsers } from "../controllers/userControllers";
import { protecRoute } from "../middleware/auth";

const router = Router();


router.get("/", protecRoute, getUsers)
export default router;