import express from 'express';
import AuthController from '../../controllers/auth';
import { health } from '../../controllers/health';

export default () => {
  const router = express.Router();

  const controllers = [new AuthController()];

  controllers.forEach((controller) => {
    router.use(controller.path, controller.router);
  });

  router.use('/health', health);

  return router;
};
