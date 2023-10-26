import { UserRepository } from "@fyp/db";
import { Router } from "express";
import { requireAuth } from "../auth/middleware";

const router = Router();

router.get('/all', requireAuth, async(req, res) => {

  const user = await UserRepository.findUserById(req.user?.id as string);

  res.status(200).json({
    id: user?.id,
    email: user?.email
  });

});

export default router;