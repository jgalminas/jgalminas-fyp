import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import { RecordingRepository } from "@fyp/db";
import { z } from 'zod';

const router = Router();

router.post('/', requireAuth, async(req, res) => {

  const id = await RecordingRepository.insertRecording(req.user?._id.toString() as string, req.body);

  res.status(200).send(id);
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
    const recordings = await RecordingRepository.getRecordings(
      req.user?._id.toString() as string,
      parsed.data.query
    );

    res.status(200).json(recordings);
  } else {
    res.status(400).json(parsed.error.errors);
  }

})

export default router;