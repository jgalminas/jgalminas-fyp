require('dotenv').config();
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import * as middlewares from './middleware/middlewares';
import v1 from './routes';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { passportConfig } from './auth/passport';
import session from 'express-session';
import env from './env';
import { LolApi } from 'twisted';
import MongoStore from 'connect-mongo';

export const app = express();
export const twisted = new LolApi(env.RIOT_KEY);

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({
  origin: env.WEB_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: env.SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    expires: new Date(Date.now() + 604_800) // 1 week
  },
  store: MongoStore.create({
    mongoUrl: env.MONGODB_CONNECTION_STRING
  })
}));


// auth
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// routes
app.use('/v1', v1);

// middleware
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);