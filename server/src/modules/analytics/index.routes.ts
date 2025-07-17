import express from "express";
import analyticsRouter from "./analytics.routes";

const router = express.Router();

router.use("/analytics", analyticsRouter);

export default router;
