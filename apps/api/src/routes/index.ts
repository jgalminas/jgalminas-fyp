import { Router } from 'express';
import authRouter from './auth';
import userRouter from './user';
import matchRouter from './match';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter)
router.use('/match', matchRouter)

export default router;
