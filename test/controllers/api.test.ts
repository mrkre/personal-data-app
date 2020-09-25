import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app';

describe('(Controller) API', () => {
  describe('GET /', () => {
    it('should return 404 NOT FOUND', () => {
      return request(app).get('/').expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET /health', () => {
    it('should return 200 OK', () => {
      return request(app).get('/health').expect(httpStatus.OK);
    });
  });

  describe('GET /api/health', () => {
    it('should return 200 OK', () => {
      return request(app).get('/api/health').expect(httpStatus.OK);
    });
  });

  describe('GET /api/v1/health', () => {
    it('should return 200 OK', () => {
      return request(app).get('/api/v1/health').expect(httpStatus.OK);
    });
  });
});
