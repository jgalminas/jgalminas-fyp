import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import { HighlightRepository } from "@fyp/db";

const router = Router();

router.post('/', requireAuth, async(req, res) => {

  const highlight = await HighlightRepository.insertHighlight(req.user?._id.toString() as string, req.body);

  res.status(200).send(highlight);
})

export default router;