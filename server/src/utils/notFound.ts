import { Response, Request } from 'express';
import { AppError } from './AppError';
const notFound = (req: Request, res: Response) => {
  throw new AppError('Route not Found', 404);
};
export default notFound;
