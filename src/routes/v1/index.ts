import express from 'express';
import AuthController from '../../controllers/v1/auth';
import ProfileController from '../../controllers/v1/profile';
import HealthController from '../../controllers/common/health';

export default () => {
  const router = express.Router();

  const controllers = [new HealthController(), new AuthController(), new ProfileController()];

  controllers.forEach((controller) => {
    router.use(controller.path, controller.router);
  });

  return router;
};
