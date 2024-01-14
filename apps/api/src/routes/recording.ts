import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import { RecordingRepository } from "@fyp/db";

const router = Router();

router.post('/', requireAuth, async(req, res) => {

  const id = await RecordingRepository.insertRecording(req.user?._id.toString() as string, req.body);

  res.status(200).send(id);
})

router.get('/all', requireAuth, async(req, res) => {
  res.status(200).json(await RecordingRepository.getRecordings(req.user?._id.toString() as string));
})

export default router;