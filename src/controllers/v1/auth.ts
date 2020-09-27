import { Request, Response } from 'express';
import { body } from 'express-validator';
import passport from 'passport';
import * as jwt from 'jsonwebtoken';
import BaseController from '../common/base';
import UserService from '../../services/user';
import messages from '../../messages/auth';
import BadRequestException from '../../exceptions/BadRequestException';
import { JWT_SECRET_OR_KEY, JWT_TOKEN_EXPIRATION } from '../../util/secrets';

/**
 * @class AuthController
 */
class AuthController extends BaseController {
  private userService: UserService;

  constructor() {
    super('/auth');
    this.initRoutes();
    this.userService = new UserService();
  }

  public initRoutes(): void {
    this.router.post(
      '/login',
      this.validate([
        body('email').isEmail().withMessage(messages.INVALID_EMAIL),
        body('password').notEmpty().withMessage(messages.PASSWORD_REQUIRED),
      ]),
      this.login,
    );
    this.router.post('/logout', this.logout);
    this.router.post(
      '/register',
      this.validate([
        // eslint-disable-next-line @typescript-eslint/camelcase
        body('email').normalizeEmail({ gmail_remove_dots: false }).isEmail().withMessage(messages.INVALID_EMAIL),
        body('password').notEmpty(),
      ]),
      this.register,
    );
  }

  /**
   * Login
   * @route POST /auth/login
   * @memberOf AuthController
   */
  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException(messages.INVALID_EMAIL_OR_PASSWORD);
    }

    const isMatch = await user.validatePassword(password);

    if (!isMatch) {
      throw new BadRequestException(messages.INVALID_EMAIL_OR_PASSWORD);
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET_OR_KEY, { expiresIn: JWT_TOKEN_EXPIRATION });

    return this.ok(res, { token });
  };

  /**
   * Logout
   * @route POST /auth/logout
   * @memberOf AuthController
   */
  logout = (req: Request, res: Response) => {
    req.logout();
    return this.ok(res, { message: messages.LOGGED_OUT, timestamp: new Date() });
  };

  /**
   * Register
   * @route POST /auth/register
   * @memberOf AuthController
   */
  register = (req: Request, res: Response) => {
    return this.ok(res, {});
  };
}

export default AuthController;
