import { Router } from 'express';
import authRouter from './auth';
import userRouter from './user';
import matchRouter from './match';
import recordingRouter from './recording';
import highlightRouter from './highlight';
import summonerRouter from './summoner';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/match', matchRouter);
router.use('/recording', recordingRouter);
router.use('/highlight', highlightRouter);
router.use('/summoner', summonerRouter);

export default router;
