import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { HttpException, NotFoundException } from '../exceptions';

// catch 404 and forward to error handler
export function handleNotFound(req: Request, res: Response, next: NextFunction) {
  const err = new NotFoundException(`${req.path} not found`);
  return next(err);
}

// default error handler
export function handleError(error: HttpException, req: Request, res: Response, next: NextFunction) {
  const status = error.status || httpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Something went wrong';

  res.status(status).send({ message });
}
