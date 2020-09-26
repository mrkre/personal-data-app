import { Request, Response } from 'express';
import BaseController from './base';

class AuthController extends BaseController {
  constructor() {
    super('/auth');
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.post('/login', this.login);
    this.router.post('/logout', this.logout);
    this.router.post('/register', this.register);
  }

  login = (req: Request, res: Response) => {
    return this.ok(res, {});
  };

  logout = (req: Request, res: Response) => {
    return this.ok(res, {});
  };

  register = (req: Request, res: Response) => {
    return this.ok(res, {});
  };
}

export default AuthController;
