import express from 'express';
import {getJobs, submitApplication, getApplications, delApplication, getSingleJob} from '../controllers/student.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const router = express.Router();

router.get('/jobs', authMiddleware, getJobs);
router.get('/applications', authMiddleware, getApplications);
router.get('/jobs/:id', authMiddleware, getSingleJob);
router.post('/jobs/:id', authMiddleware, submitApplication);
router.delete('/applications/:id', authMiddleware, delApplication);

export default router