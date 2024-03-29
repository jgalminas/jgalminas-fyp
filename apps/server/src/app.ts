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
import { LolApi, RiotApi } from 'twisted';
import MongoStore from 'connect-mongo';
import Agenda from 'agenda';
import jobs from './jobs';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { WebSocketService } from './services/webSocketService';

export const app = express();
export const twisted = new LolApi(env.RIOT_KEY);
export const riot = new RiotApi(env.RIOT_KEY);

export const agenda = new Agenda({
  db: {
    address: env.MONGODB_CONNECTION_STRING,
    collection: 'matchqueue'
  },
  maxConcurrency: 10,
  processEvery: '1 second'
})

agenda.start();
jobs(); // regsiter jobs

export const httpServer = createServer(app);
export const wss = new WebSocketServer({ noServer: true });

const sessionParser = session({
  secret: env.SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: 604_800_000, // 1 week,
    httpOnly: true,
    sameSite: 'strict'
  },
  store: MongoStore.create({
    mongoUrl: env.MONGODB_CONNECTION_STRING,
    stringify: false
  })
})

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({
  origin: env.WEB_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use(sessionParser);


// auth
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);


httpServer.on('upgrade', (req, socket, head) => {
  // @ts-expect-error
  sessionParser(req, {}, () => {
    
    if (!req.session.passport) {
      socket.write('HTTP/1.1 401 Unauthorized');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  })

})

// routes
app.use('/v1', v1);

// middleware
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// Services
export const WSService = new WebSocketService(wss);