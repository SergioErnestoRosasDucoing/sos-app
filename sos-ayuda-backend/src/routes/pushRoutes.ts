import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { subscribe, unsubscribe } from '../controllers/pushController';

const router = Router();

router.post('/subscribe', authMiddleware, subscribe);
router.delete('/subscribe', authMiddleware, unsubscribe);

export default router;
