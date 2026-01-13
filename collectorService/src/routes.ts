import { Router } from "express";
import { handleCollect } from "./controller";

const router = Router();
router.get("/collect", handleCollect);

export default router;
