import { UserRepository } from "@fyp/db";
import { Router } from "express";
import { requireAuth } from "../auth/middleware";

const router = Router();

router.get('/all', requireAuth, async(req, res) => {

  // @ts-ignore
  const user = await UserRepository.findUserById(req.user?._id);

  res.status(200).json({
    id: user?._id,
    email: user?.email
  });

});

export default router;