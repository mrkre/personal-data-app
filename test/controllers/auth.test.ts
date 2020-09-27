import request from 'supertest';
import httpStatus from 'http-status';
import { expect } from 'chai';
import app from '../../src/app';
import User from '../../src/models/User';
import messages from '../../src/messages/auth';

describe('(Controllers) Auth', () => {
  const users = [
    new User({ email: 'test@test.com', password: 'password', active: true }),
    new User({ email: 'inactive@test.com', password: 'password', active: false }),
  ];

  beforeAll(async () => {
    await Promise.all(users.map((user) => user.save()));
  });

  describe('POST /api/v1/auth/login', () => {
    describe('should return 200 ', () => {
      it('with correct credentials', () => {
        return request(app)
          .post('/api/v1/auth/login')
          .send({ email: users[0].email, password: 'password' })
          .expect(httpStatus.OK)
          .then((result) => {
            expect(result.body.token).to.exist;
          });
      });
    });
    describe('should return 400', () => {
      it('without correct body', () => {
        return request(app)
          .post('/api/v1/auth/login')
          .send({})
          .expect(httpStatus.BAD_REQUEST)
          .then((result) => {
            const { message, errors } = result.body;
            expect(message).to.equal('Validation error');
            expect(errors).to.have.deep.members([
              { msg: messages.PASSWORD_REQUIRED, param: 'password', location: 'body' },
              { msg: messages.PASSWORD_WEAK, param: 'password', location: 'body', value: '' },
              { msg: messages.INVALID_EMAIL, param: 'email', location: 'body' },
            ]);
          });
      });
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout user', async () => {
      await request(app)
        .post('/api/v1/auth/login')
        .send({ email: users[0].email, password: 'password' })
        .expect(httpStatus.OK);

      await request(app)
        .post('/api/v1/auth/logout')
        .expect(httpStatus.OK)
        .then((result) => {
          expect(result.body.message).to.equal(messages.LOGGED_OUT);
          expect(result.body.timestamp).to.exist;
        });
    });
  });

  describe('POST /api/v1/auth/register', () => {
    describe('should return 400', () => {
      it('without correct body', () => {
        return request(app)
          .post('/api/v1/auth/register')
          .send({})
          .expect(httpStatus.BAD_REQUEST)
          .then((result) => {
            const { message, errors } = result.body;
            expect(message).to.equal('Validation error');

            expect(errors).to.have.deep.members([
              { msg: messages.PASSWORD_REQUIRED, param: 'password', location: 'body' },
              { msg: messages.PASSWORD_WEAK, param: 'password', location: 'body', value: '' },
              { msg: messages.CONFIRM_PASSWORD_REQUIRED, param: 'confirmPassword', location: 'body' },
              { msg: messages.INVALID_EMAIL, param: 'email', location: 'body', value: '@' },
            ]);
          });
      });
    });
  });
});
