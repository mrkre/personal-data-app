import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app';

describe('(Controller) API', () => {
  describe('GET /', () => {
    it('should return 200 OK', () => {
      return request(app).get('/').expect(httpStatus.OK);
    });
  });

  describe('GET /api', () => {
    it('should return 404 not found', () => {
      return request(app).get('/api').expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET /health', () => {
    it('should return 200 OK', () => {
      return request(app).get('/health').expect(httpStatus.OK);
    });
  });
});
