import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import { MatchRepository } from "@fyp/db";
import { twisted } from "../app";
import { regionToRegionGroup } from "twisted/dist/constants";
import { extractMatchData } from "../helpers/match";

const router = Router();

router.post('/post', requireAuth, async(req, res) => {

  const matchId = `${req.body.region}_${req.body.matchId}`;
  const region = regionToRegionGroup(req.body.region);

  const match = twisted.MatchV5.get(matchId, region);
  const timeline = twisted.MatchV5.timeline(matchId, region);
  
  const data = await Promise.all([match, timeline]);

  const id = await MatchRepository.insertMatch(extractMatchData(data[0].response, data[1].response));

  res.status(200).send({
    id
  })
})

router.get('/list', requireAuth, async(req, res) => {

  const match = await MatchRepository.getUserMatches(req.user?.puuid as string);

  res.send(match)
})

export default router;
