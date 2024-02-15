import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import { riot } from "../app";
import { regionToRegionGroup } from "twisted/dist/constants";

const router = Router();

router.post('/', requireAuth, async(req, res) => {

  const { username, tag, region } = req.body;

  if (!username || !tag || !region) {
    res.status(400).send();
  }

  const regionGroup = regionToRegionGroup(region);
  const summoner = await riot.Account.getByRiotId(username, tag, regionGroup);

  res.status(200).send(summoner.response);
})

export default router;