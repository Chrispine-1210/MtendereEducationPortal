import { Router } from 'express';

const router = Router();

// Example route: /api/jobs

import { getJobs } from '../controllers/jobsController';
import { getTestimonials } from '../controllers/testimonialsController';
import { getPartners } from '../controllers/partnersController';

router.get('/jobs', getJobs);
router.get('/testimonials', getTestimonials);
router.get('/partners', getPartners);

// Add more routes as needed

export default router;
