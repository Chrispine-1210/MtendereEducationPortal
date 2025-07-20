import { Router } from "express";
import { sampleController } from "./auth.controller";

const router = Router();

router.get("/", sampleController);

export default router;
