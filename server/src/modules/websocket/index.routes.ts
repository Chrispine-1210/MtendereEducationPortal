import express from "express";
import wsRouter from "./ws.routes";

const router = express.Router();

router.use("/ws", wsRouter);

export default router;
