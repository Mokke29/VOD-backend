import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import { pool } from './DB/pgdb/poolconn';
import session from 'express-session';
import 'dotenv/config';
import passport from 'passport';
import './strategies/local';
import './DB/mongodb/connection';
import { router } from './routes/app';
import { loginRoutes } from './routes/login';
import { registerRoutes } from './routes/register';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { socketFunction } from './routes/watchtogether/socket';

const reqOriginLocal = ['http://localhost:3000', 'http://localhost:3002'];
const PORT = 3001;
const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: { origin: reqOriginLocal },
  serveClient: false,
});
//MIDDLEWARE
app.set('view engine', 'ejs');
app.use((req: Request, res: Response, next: NextFunction) => {
  cors({
    origin: reqOriginLocal,
    credentials: true,
    optionsSuccessStatus: 200,
  });
  next();
});
app.use(
  '/public',
  express.static(path.join(__dirname, '../', 'src', 'public'))
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 50000,
  })
);
app.use(bodyParser.json());

//SESSION
app.use(
  session({
    store: new (require('connect-pg-simple')(session))({
      pool: pool,
    }),
    name: 'random_session',
    secret: 'N6HLEL6MI7',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 30000 * 2 * 60, //1 min * 60
      path: '/',
      httpOnly: false,
    },
  })
);
app.use(cookieParser('N6HLEL6MI7'));
app.use(passport.initialize());
app.use(passport.session());
//CORS HEADERS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Methods',
    'GET,PUT,POST,PATCH,DELETE,OPTIONS'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *'
  );
  next();
});

//ROUTES
socketFunction(io);
app.use('/api', loginRoutes);
app.use('/api', registerRoutes);
app.use('/api', router);

httpServer.listen(PORT, () => {
  console.log(`Server listening on PORT:${PORT}`);
});
