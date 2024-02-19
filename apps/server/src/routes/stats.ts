import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import { getAverageStats, getChampionStats } from "../repositories/stats";

const router = Router();

router.get('/match', requireAuth, async(req, res) => {

  res.status(200).send(await getChampionStats(req.user?.summoner?.puuid as string));
})

export default router;