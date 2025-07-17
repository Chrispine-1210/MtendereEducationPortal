import express from "express";
import { WebSocketController } from "./ws.controller";

const router = express.Router();

router.get("/", WebSocketController.status);

export default router;
