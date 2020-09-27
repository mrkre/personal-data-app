import { Request, Response, NextFunction } from 'express';
import { omit } from 'lodash';
import httpStatus from 'http-status';
import { HttpException, NotFoundException } from '../exceptions';
import logger from '../util/logger';
import { ENVIRONMENT } from '../util/secrets';

// catch 404 and forward to error handler
export function handleNotFound(req: Request, res: Response, next: NextFunction) {
  const err = new NotFoundException(`${req.path} not found`);
  return next(err);
}

// default error handler
export function handleError(error: HttpException, req: Request, res: Response, next: NextFunction) {
  const { status = httpStatus.INTERNAL_SERVER_ERROR, errors, stack } = error;

  const message = error.message?.length > 0 ? error.message : 'Something went wrong';

  const isDebug = ENVIRONMENT === 'development';

  // log error
  if (status >= httpStatus.INTERNAL_SERVER_ERROR || isDebug) {
    logger.error({
      message,
      stack,
      url: req.url,
      method: req.method,
      body: omit(req.body, ['password', 'secret']),
    });
  }

  res.status(status).send({ message, errors, stack: isDebug ? stack : undefined });
}
