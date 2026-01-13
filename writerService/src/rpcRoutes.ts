import { Router } from "express";
import { rpcHandler } from "./rpcController";

const router = Router();
router.post("/rpc", rpcHandler);

export default router;
