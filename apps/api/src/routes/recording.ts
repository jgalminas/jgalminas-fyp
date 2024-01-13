import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import { RecordingRepository } from "@fyp/db";

const router = Router();

router.post('/', requireAuth, async(req, res) => {

  const id = await RecordingRepository.insertRecording(req.body);

  res.status(200).send(id);
})

export default router;