import { Request, Response } from 'express';
import { body } from 'express-validator';
import BaseController from '../common/base';

class AuthController extends BaseController {
  constructor() {
    super('/auth');
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.post(
      '/login',
      this.validate([
        body('email').isEmail().withMessage('Invalid email'),
        body('password').notEmpty().withMessage('Password is required'),
      ]),
      this.login,
    );
    this.router.post('/logout', this.logout);
    this.router.post('/register', this.register);
  }

  /**
   * Login
   * @route POST /auth/login
   */
  login = async (req: Request, res: Response) => {
    return this.ok(res, {});
  };

  /**
   * Logout
   * @route POST /auth/logout
   */
  logout = (req: Request, res: Response) => {
    return this.ok(res, {});
  };

  /**
   * Register
   * @route POST /auth/register
   */
  register = (req: Request, res: Response) => {
    return this.ok(res, {});
  };
}

export default AuthController;
