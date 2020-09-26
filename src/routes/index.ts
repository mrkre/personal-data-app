import express from 'express';
import apiV1 from './v1';
import { health } from '../controllers/health';

export default () => {
  const router = express.Router();

  router.use('/health', health);
  router.use('/api/v1', apiV1());

  return router;
};
