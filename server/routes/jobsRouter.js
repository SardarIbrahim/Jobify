import express from 'express';
const router = express.Router();
import {
  createJob,
  deleteJob,
  getAllJobs,
  showStats,
  updateJob,
} from '../controllers/jobsController.js';
import authenticateUser from '../middlewares/auth.js';

router
  .route('/')
  .post(authenticateUser, createJob)
  .get(authenticateUser, getAllJobs);
router.route('/stats').get(authenticateUser, showStats);
router
  .route('/:id')
  .delete(authenticateUser, deleteJob)
  .patch(authenticateUser, updateJob);

export default router;
