import { Router } from 'express';
import authRouter from './auth';
import userRouter from './user';
import matchRouter from './match';
import recordingRouter from './recording';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/match', matchRouter);
router.use('/recording', recordingRouter);

export default router;
