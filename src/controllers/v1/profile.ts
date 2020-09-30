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
    this.router.post(
      '/',
      authenticate,
      this.validate([
        body('key').exists().withMessage(messages.ENCRYPTION_KEY_REQUIRED),
        body('profile').exists().withMessage(messages.PROFILE_REQUIRED),
        body('profile.firstName').optional().isString().trim(),
        body('profile.lastName').optional().isString().trim(),
        body('profile.dateOfBirth').optional().isISO8601(),
        body('profile.address.street').optional().isString().trim(),
        body('profile.address.city').optional().isString().trim(),
        body('profile.address.unit').optional().isString().trim(),
        body('profile.address.country').optional().isString().trim(),
        body('profile.address.postalCode').optional().isString().trim(),
        body('profile.phone').optional().isString().trim(),
      ]),
      asyncHandler(this.post),
    );
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
