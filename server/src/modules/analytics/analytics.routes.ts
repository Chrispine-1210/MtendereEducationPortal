import { Router } from "express";
import { sampleController } from "./analytics.controller";

const router = Router();

router.get("/", sampleController);

export default router;
