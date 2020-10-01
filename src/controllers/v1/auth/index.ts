import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as jwt from 'jsonwebtoken';
import BaseController from '../../common/base';
import UserService from '../../../services/user';
import messages from '../../../messages/auth';
import BadRequestException from '../../../exceptions/BadRequestException';
import { JWT_SECRET_OR_KEY, JWT_TOKEN_EXPIRATION } from '../../../util/secrets';
import { authenticate } from '../../../config/passport';
import validations from './validations';

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
    this.router.post('/login', this.validate(validations.login), asyncHandler(this.login));
    this.router.post('/logout', this.logout);
    this.router.post('/register', this.validate(validations.register), asyncHandler(this.register));
    this.router.get('/token', authenticate, this.authenticate);
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

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET_OR_KEY, {
      expiresIn: JWT_TOKEN_EXPIRATION,
    });

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
  register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await this.userService.create(email, password);

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET_OR_KEY, {
      expiresIn: JWT_TOKEN_EXPIRATION,
    });

    return this.ok(res, { token });
  };

  /**
   * Authenticate token
   * @route POST /auth/token
   * @memberOf AuthController
   */
  authenticate = (req: Request, res: Response) => {
    const user = req.user;

    return this.ok(res, { id: user });
  };
}

export default AuthController;
