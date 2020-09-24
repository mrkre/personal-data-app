import express from 'express';
import apiV1 from './v1';
import { health } from '../controllers/health';

export default () => {
  const router = express.Router();

  router.get('/', health);

  router.use('/v1', apiV1);
  router.use('/health', health);

  return router;
};
