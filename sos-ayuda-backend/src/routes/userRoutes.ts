import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { updateMe } from '../controllers/userController';

const router = Router();

router.patch('/me', authMiddleware, updateMe);

export default router;
