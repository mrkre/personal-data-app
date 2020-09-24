import { Response, Request } from 'express';


/**
 * List of API examples.
 * @route GET /api
 */
export const getApi = (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.send({ status: 'OK' });
};
