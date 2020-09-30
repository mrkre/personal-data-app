import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app';

describe('(Controllers) Profile', () => {
  describe('GET /api/v1/profile', () => {
    // TODO: Add authenticated tests
    // TODO: Add validation tests
    describe('when unauthenticated', () => {
      it('should return 401', () => {
        return request(app).get('/api/v1/profile').expect(httpStatus.UNAUTHORIZED);
      });
    });
  });
  describe('POST /api/v1/profile', () => {
    describe('when unauthenticated', () => {
      it('should return 401', () => {
        return request(app).post('/api/v1/profile').send({ key: 'key', profile: {} }).expect(httpStatus.UNAUTHORIZED);
      });
    });
  });
});
