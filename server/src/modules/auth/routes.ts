
import { AuthController } from './auth.controller';
import { Router } from 'express';

const router = Router();

router.get('/sample', sampleController);

export default router;
