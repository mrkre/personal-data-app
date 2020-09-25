import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED } from 'http-status';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(UNAUTHORIZED).send({ message: 'Unauthorized' });
};
