import { UserRepository } from "@fyp/db";
import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import { riot, twisted } from "../app";
import { z } from "zod";
import { Regions, regionToRegionGroup } from "twisted/dist/constants";
import { REGIONS } from "@fyp/types";

const router = Router();

router.put('/summoner', requireAuth, async(req, res) => {

  const schema = z.object({
    name: z.string(),
    tag: z.string(),
    region: z.enum(REGIONS)
  })

  const result = await schema.safeParseAsync(req.body);

  if (result.success) {

    try {
      const account = await riot.Account.getByRiotId(
        result.data.name,
        result.data.tag,
        regionToRegionGroup(result.data.region as Regions)
      )
  
      const summoner = await twisted.Summoner.getByPUUID(account.response.puuid, result.data.region as Regions);
  
      const data = {
        name: account.response.gameName,
        tag: account.response.tagLine,
        puuid: account.response.puuid,
        profileIconId: summoner.response.profileIconId,
        region: result.data.region
      }
  
      await UserRepository.updateSummoner(req.user?._id.toString() as string, data); 
  
      res.status(200).json(data);
    } catch(err) {
      res.status(400).send();
    }
    
  } else {
    res.status(400).send(result.error.errors);
  }

});

export default router; 