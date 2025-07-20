import { Router } from "express";
import { sampleController } from "./applications.controller";

const router = Router();

router.get("/", sampleController);

export default router;
