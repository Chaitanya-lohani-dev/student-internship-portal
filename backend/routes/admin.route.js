import express from 'express';
import {authMiddleware} from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';
import { getJobs, getApplications, createJob, updateApplications, updateJob} from '../controllers/admin.controllers.js';

const router = express.Router();

router.post('/jobs',authMiddleware, adminMiddleware, createJob)
router.put('/jobs/:id',authMiddleware, adminMiddleware, updateJob)
router.get('/jobs',authMiddleware, adminMiddleware, getJobs)
router.get('/applications',authMiddleware, adminMiddleware, getApplications)
router.patch('/applications/:id/status',authMiddleware, adminMiddleware, updateApplications)

export default router