import { Router } from 'express';
import { sampleController } from './your.controller';

const router = Router();

router.get('/sample', sampleController);

export default router;
