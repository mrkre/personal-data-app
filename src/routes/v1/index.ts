import express from 'express';
import AuthController from '../../controllers/v1/auth';
import HealthController from '../../controllers/common/health';

export default () => {
  const router = express.Router();

  const controllers = [new HealthController(), new AuthController()];

  controllers.forEach((controller) => {
    router.use(controller.path, controller.router);
  });

  return router;
};
