import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import { MatchRepository } from "@fyp/db";

const router = Router();

router.post('/test', requireAuth, async(req, res) => {

  console.log(req.user?._id);
  
  const match = await MatchRepository.insertMatch(req.user?._id, req.body);

  res.send({
    match
  })
})

router.get('/list', requireAuth, async(req, res) => {

  const match = await MatchRepository.getUserMatches(req.user?._id);

  res.send(match)
})

export default router;
