import logger from './logger';
import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
} else {
  logger.debug('Using .env.example file to supply config environment variables');
  dotenv.config({ path: '.env.example' }); // you can delete this after you create your own .env file!
}

export const ENVIRONMENT = process.env.NODE_ENV;

const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env['SESSION_SECRET'];
export const MONGO_URL =
  ENVIRONMENT === 'prod' || ENVIRONMENT === 'test' ? process.env['MONGO_URL'] : process.env['MONGO_URL_LOCAL'];

if (!SESSION_SECRET) {
  logger.error('No client secret. Set SESSION_SECRET environment variable.');
  process.exit(1);
}

if (!MONGO_URL) {
  if (prod) {
    logger.error('No mongo connection string. Set MONGO_URL environment variable.');
  } else {
    logger.error('No mongo connection string. Set MONGO_URL_LOCAL environment variable.');
  }
  process.exit(1);
}

export const JWT_SECRET_OR_KEY = process.env['JWT_SECRET_OR_KEY'];
export const JWT_TOKEN_EXPIRATION = process.env['JWT_TOKEN_EXPIRATION'] || 30 * 60 * 1000;

if (!JWT_SECRET_OR_KEY) {
  logger.error('JWT secret is required');
  process.exit(1);
}
