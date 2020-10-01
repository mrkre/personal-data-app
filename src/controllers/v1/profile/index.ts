import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import BaseController from '../../common/base';
import { authenticate } from '../../../config/passport';
import ProfileService from '../../../services/profile';
import validations from './validations';

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
    this.router.post('/', authenticate, this.validate(validations.post), asyncHandler(this.post));
  }

  /**
   * Get
   * @route GET /profile
   * @memberOf ProfileController
   */
  get = async (req: Request, res: Response) => {
    const profile = await this.profileService.get(req.user.id, req.query.key as string);
    return this.ok(res, profile || {});
  };

  /**
   * Post
   * @route POST /profile
   * @memberOf ProfileController
   */
  post = async (req: Request, res: Response) => {
    const { key, profile } = req.body;
    const updatedProfile = await this.profileService.createOrUpdate(req.user.id, key, profile);
    return this.ok(res, updatedProfile);
  };
}

export default ProfileController;
