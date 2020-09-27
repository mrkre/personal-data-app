import request from 'supertest';
import httpStatus from 'http-status';
import { expect } from 'chai';
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

  describe('GET /api/v1/health', () => {
    it('should return 200 OK', () => {
      return request(app).get('/api/v1/health').expect(httpStatus.OK);
    });
  });

  describe('GET /404', () => {
    it('should return 400 unknown', () => {
      return request(app)
        .get('/404')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('/404 not found');
        });
    });
  });
});
