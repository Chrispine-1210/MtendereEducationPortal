import { Router } from "express";
import { sampleController } from "./courses.controller";

const router = Router();

router.get("/", sampleController);

export default router;
