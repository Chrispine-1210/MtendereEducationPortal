import { Router } from "express";
import { sampleController } from "../controllers/analytics.controller";

const router = Router();

router.get("/", sampleController);

export default router;
