import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import { MatchRepository } from "@fyp/db";

const router = Router();

router.post('/post', requireAuth, async(req, res) => {

  const match = await MatchRepository.insertMatch(req.body);

  res.send({
    match
  })
})

router.get('/list', requireAuth, async(req, res) => {

  const match = await MatchRepository.getUserMatches(req.user?.puuid as string);

  res.send(match)
})

export default router;
