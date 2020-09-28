import { Request, Response } from 'express';
import { body } from 'express-validator';
import asyncHandler from 'express-async-handler';
import BaseController from '../common/base';
import { authenticate } from '../../config/passport';
import ProfileService from '../../services/profile';
import messages from '../../messages/profile';

/**
 * @class ProfileController
 */
class ProfileController extends BaseController {
  private profileService: ProfileService;

  constructor() {
    super('/profile');
    this.initRoutes();
    this.profileService = new ProfileService();
  }

  public initRoutes(): void {
    this.router.get('/', authenticate, asyncHandler(this.get));
  }

  get = async (req: Request, res: Response) => {
    const profile = await this.profileService.get(req.user.id);
    return this.ok(res, profile || {});
  };
}

export default ProfileController;
