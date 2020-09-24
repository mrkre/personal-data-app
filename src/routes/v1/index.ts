import express from 'express';
import { health } from '../../controllers/health';

export default () => {
  const router = express.Router();

  router.use('/health', health);

  return router;
};
