import { Router } from "express";
import { sampleController } from "./scholarships.controller";

const router = Router();

router.get("/", sampleController);

export default router;
