import { Router } from "express";
import { HealthController } from  "../controllers/health.contoller";

const router = Router();

router.get("/", HealthController.checkHealth);

export default router;