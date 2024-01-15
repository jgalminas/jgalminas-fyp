import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import { MatchRepository } from "@fyp/db";
import { agenda } from "../app";
import { regionToRegionGroup } from "twisted/dist/constants";
import { MatchDataContract } from "../jobs";

const router = Router();

router.post('/', requireAuth, async(req, res) => {

  const gameId = `${req.body.region}_${req.body.gameId}`;
  const matchId = req.body.matchId;
  const region = regionToRegionGroup(req.body.region);

  await agenda.now<MatchDataContract>('GET_MATCH_DATA', { gameId, matchId, region });

  res.status(200).send();
})

router.get('/list', requireAuth, async(req, res) => {

  const match = await MatchRepository.getUserMatches(req.user?.puuid as string);

  res.send(match)
})

router.get('/:id', requireAuth, async(req, res) => {

  const match = await MatchRepository.getMatchById(req.params.id);

  if (match) {
    res.send(match);
  } else {
    res.status(404).send();
  }

})

export default router;
