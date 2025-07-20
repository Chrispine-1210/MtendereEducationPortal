import { Router } from "express";
import { sampleController } from "./testimonials.controller";

const router = Router();

router.get("/", sampleController);

export default router;
