import { Router } from 'express';
import authRouter from './auth';
import userRouter from './user';
import { MatchRepository } from '@fyp/db';
import { requireAuth } from '../auth/middleware';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter)

router.post('/test', requireAuth, async(req, res) => {

  console.log(req.user?._id);
  
  const match = await MatchRepository.insertMatch(req.user?._id, req.body);

  res.send({
    match
  })
})

router.get('/m', requireAuth, async(req, res) => {

  console.log(req.user?._id);
  
  const match = await MatchRepository.getUserMatches(req.user?._id);

  res.send(match)
})

export default router;
