import { body } from 'express-validator';
import messages from '../../../messages/auth';
import BadRequestException from '../../../exceptions/BadRequestException';

const login = [
  body('email').isEmail().trim().withMessage(messages.INVALID_EMAIL),
  body('password')
    .exists()
    .trim()
    .withMessage(messages.PASSWORD_REQUIRED)
    .isLength({ min: 6 })
    .withMessage(messages.PASSWORD_WEAK),
];

const register = [
  // eslint-disable-next-line @typescript-eslint/camelcase
  body('email').normalizeEmail({ gmail_remove_dots: false }).isEmail().withMessage(messages.INVALID_EMAIL),
  body('password')
    .exists()
    .trim()
    .withMessage(messages.PASSWORD_REQUIRED)
    .isLength({ min: 6 })
    .withMessage(messages.PASSWORD_WEAK),
  body('confirmPassword')
    .exists()
    .withMessage(messages.CONFIRM_PASSWORD_REQUIRED)
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new BadRequestException(messages.PASSWORDS_DO_NOT_MATCH);
      }
      return true;
    }),
];

export default {
  login,
  register,
};
