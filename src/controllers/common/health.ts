import { Response, Request } from 'express';
import BaseController from './base';

class HealthController extends BaseController {
  constructor() {
    super('/health');
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get('/', this.getHealth);
  }

  /**
   * Health check
   * @route GET /health
   */
  getHealth = (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-cache');
    return this.ok(res, { message: 'OK' });
  };
}

export default HealthController;
