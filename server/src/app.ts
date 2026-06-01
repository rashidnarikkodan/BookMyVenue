import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http'
import logger from '@/libs/logger';
import success from '@/utils/response';
import notFound from '@/utils/notFound';
import errorHandler from './utils/error';

const app: Application = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

//logger
app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => req.url === "/favicon.ico",
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
app.use(express.urlencoded({extended:true}));

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use("/admin")
app.use("/owner")

app.get('/', (req: Request, res: Response) => {
  success(res,200,'API running successfully',null)
});

app.use(notFound);
app.use(errorHandler);

export default app;
