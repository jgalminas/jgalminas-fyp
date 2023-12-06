import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import { MatchRepository } from "@fyp/db";
import { agenda } from "../app";
import { regionToRegionGroup } from "twisted/dist/constants";
import { MatchDataContract } from "../jobs";

const router = Router();

router.post('/post', requireAuth, async(req, res) => {

  const matchId = `${req.body.region}_${req.body.gameId}`;
  const region = regionToRegionGroup(req.body.region);

  await agenda.now<MatchDataContract>('GET_MATCH_DATA', { matchId, region });

  res.status(200).send({
    id: 0
  })
})

router.get('/list', requireAuth, async(req, res) => {

  const match = await MatchRepository.getUserMatches(req.user?.puuid as string);

  res.send(match)
})

export default router;
