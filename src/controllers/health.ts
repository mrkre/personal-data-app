import { Response, Request } from 'express';

/**
 * Health check
 * @route GET /health
 */
export const health = (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.send({ status: 'OK' });
};
