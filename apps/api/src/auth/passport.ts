import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserRepository } from '@fyp/db';
import bcrypt from 'bcrypt';

export const passportConfig = (passport: PassportStatic) => {

  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async(email, password, done) => {
      
      const user = await UserRepository.findUserByEmail(email);

      if (!user) {
        return done(null, false);
      }

      const isCorrectPassword = await bcrypt.compare(password, user.password);
      
      if (isCorrectPassword) {
        return done(null, user);
      } else {
        return done(null, false);
      }

    })
  );

  passport.serializeUser((user, callback) => {
    callback(null, user.id)
  })

  passport.deserializeUser<string>(async(id, callback) => {

    try {
      const user = await UserRepository.findUserById(id);

      if (user) {
        callback(null, user);
      } else {
        callback(null, false);
      }

    } catch (err) {
      callback(err);
    }

  })

}