import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import { getAverageStats, getChampionStats } from "../repositories/stats";

const router = Router();

router.get('/summary', requireAuth, async(req, res) => {

  if (!req.user?.summoner) {
    return res.status(400).send("Summoner not selected");
  }

  const result = await getAverageStats(req.user.summoner.puuid);

  if (!result) {
    return res.status(400).send();
  }

  res.status(200).send(result);
})

router.get('/champions', requireAuth, async(req, res) => {

  if (!req.user?.summoner) {
    return res.status(400).send("Summoner not selected");
  }

  res.status(200).send(await getChampionStats(req.user.summoner.puuid));
})

export default router;