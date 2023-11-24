import { UserRepository } from '@fyp/db';
import { Router } from 'express';
import passport, { AuthenticateCallback } from 'passport';
import { requireAuth } from '../auth/middleware';

const router = Router();

router.post('/login', (req, res, next) => {

  const callback: AuthenticateCallback = (err, user, info) => {

    if (!user) {
      res.status(401).json({
        message: "User with this email doesn't exist"
      });
    } else {
      req.logIn(user, () => {
        res.status(200).json({
          message: "Successfully logged in"
        });
      })
    }

  }

  passport.authenticate('local', callback)(req, res, next);
});

router.post('/signup', async(req, res) => {

  const existingUser = await UserRepository.findUserByEmail(req.body.email);

  if (existingUser) {
    return res.status(400).json({
      message: "User with this email already exists."
    });
  } else {
    const user = await UserRepository.createUser(req.body);

    req.logIn(user, () => {
      res.status(200).json({
        message: "Successfully registered",
        session: {
          userId: user._id,
          sessionId: req.session.id
        }
      });
    });

  }

});

router.get('/logout', (req, res) => {
  if (req.user) {
    req.logOut(() => {
      res.status(200).json({
        message: "Successfully logged out"
      });
    });
  } else {
    res.status(400).json({
      message: "Not logged in"
    });
  }
});

router.get('/session', requireAuth, async(req, res) => {

  const user = await UserRepository.findUserById(req.user?._id as string);
    
  res.status(200).json({
    userId: user?._id,
    sessionId: req.session.id
  });

})

export default router;