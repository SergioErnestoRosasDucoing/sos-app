import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createServiceRequest, listMyServiceRequests, payServiceRequest } from '../controllers/serviceRequestController';
import { listMessages } from '../controllers/messageController';
import { createReview } from '../controllers/reviewController';

const router = Router();

router.post('/', authMiddleware, createServiceRequest);
router.get('/', authMiddleware, listMyServiceRequests);
router.patch('/:id/pay', authMiddleware, payServiceRequest);
router.post('/:id/review', authMiddleware, createReview);
router.get('/:requestId/messages', authMiddleware, listMessages);

export default router;
