import { Router } from 'express';
import authRouter from './auth';
import userRouter from './user';
import { MatchRepository } from '@fyp/db';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter)

router.post('/test', async(req, res) => {

  const match = await MatchRepository.insertMatch(req.body);

  res.send({
    match
  })
})

export default router;
