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

const app = express();

app.use(morgan('dev'));
app.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }));
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: env.SECRET,
  resave: false,
  saveUninitialized: true
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

export default app;