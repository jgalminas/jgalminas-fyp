import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import { MatchRepository } from "@fyp/db";
import { agenda } from "../app";
import { regionToRegionGroup } from "twisted/dist/constants";
import { MatchDataContract } from "../jobs";
import { z } from "zod";

const router = Router();

router.post('/', requireAuth, async(req, res) => {

  const gameId = `${req.body.region}_${req.body.gameId}`;
  const matchId = req.body.matchId;
  const region = regionToRegionGroup(req.body.region);

  await agenda.now<MatchDataContract>(
    'GET_MATCH_DATA',
    {
      gameId,
      matchId,
      region,
      userId: req.user?._id.toString(),
      puuid: req.user?.summoner?.puuid
    }
  );

  res.status(200).send();
})

router.get('/all', requireAuth, async(req, res) => {

  const schema = z.object({
    query: z.object({
      role: z.string().optional().default('FILL'),
      queue: z.string().optional().transform((s) => s ? Number(s) : undefined),
      champion: z.string().optional(),
      date: z.union([z.literal("latest"), z.literal("oldest")]).optional().default("latest").transform((v) => v === "latest" ? -1 : 1),
      start: z.string().optional().transform((s) => s ? Number(s) : 0),
      offset: z.string().optional().transform((s) => s ? Number(s) : 10)
    })
  });

  const parsed = await schema.safeParseAsync(req);

  if (parsed.success) {

    const match = await MatchRepository.getUserMatches(req.user?.summoner?.puuid as string, parsed.data.query);

    res.status(200).json(match);
  } else {
    res.status(400).json(parsed.error.errors);
  }

})

router.get('/:id', requireAuth, async(req, res) => {

  const match = await MatchRepository.getMatchById(req.params.id);

  if (match) {
    res.send(match);
  } else {
    res.status(404).send();
  }

})

router.get('/:id/timeline', requireAuth, async(req, res) => {

  const timeline = await MatchRepository.getMatchTimeline(req.params.id);

  if (timeline) {
    res.send(timeline);
  } else {
    res.status(404).send();
  }

})

router.get('/:id/gold', requireAuth, async(req, res) => {

  const gold = await MatchRepository.getGoldFrames(req.params.id);

  if (!gold) {
    res.status(404);
  }

  res.send(gold);
})

export default router;
