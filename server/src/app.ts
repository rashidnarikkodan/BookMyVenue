import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import logger from '@/libs/logger';
import notFound from '@/utils/notFound';
import errorHandler from './utils/error';
import routes from '@/routes';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './middlewares/auth.middleware';

const app: Application = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

//logger
app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => req.url === '/favicon.ico',
    },
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  })
);

// JSON parser & Form data parse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use('/api', routes);

app.get('/home', authMiddleware, (req, res, next) => {
    console.log("auth middleware")
    return res.json({
        succes: true,
        message:"Done"
    })
})

app.use(notFound);
app.use(errorHandler);

export default app;
