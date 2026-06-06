import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import logger from '@/libs/logger';
import notFound from '@/utils/notFound';
import errorHandler from './utils/error';
import routes from '@/routes';

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

app.use(
  pinoHttp({
    logger,

    serializers: {
      req: () => undefined,
      res: () => undefined,
    },

    customLogLevel(req, res, err) {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },

    customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,

    customErrorMessage: (req, res, err) =>
      `${req.method} ${req.url} ${res.statusCode} ${err.message}`,
  })
);
// JSON parser & Form data parse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
