import { body } from 'express-validator';
import messages from '../../../messages/profile';

const post = [
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
];

export default {
  post,
};
