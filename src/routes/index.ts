import express from 'express';
import apiV1 from './v1';
import HealthController from '../controllers/common/health';

export default () => {
  const router = express.Router();

  const healthController = new HealthController();

  router.use(healthController.path, healthController.router);
  router.use('/api/v1', apiV1());

  return router;
};
