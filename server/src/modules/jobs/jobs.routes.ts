import { Router } from "express";
import { sampleController } from "./jobs.controller";

const router = Router();

router.get("/", sampleController);

export default router;
