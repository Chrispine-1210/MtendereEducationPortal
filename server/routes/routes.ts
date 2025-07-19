import { Router } from 'express';
import { getJobs } from '../controllers/jobsController';
import { getTestimonials } from '../controllers/testimonialsController';
import { getPartners } from '../controllers/partnersController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Example route: /api/jobs

router.get('/jobs', authenticate, validateRequest, getJobs);
router.get('/testimonials', authenticate, validateRequest, getTestimonials);
router.get('/partners', authenticate, validateRequest, getPartners);


// Add more routes as needed

export default router;
