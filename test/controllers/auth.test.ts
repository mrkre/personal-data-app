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

      it('when password does not match', () => {
        return request(app)
          .post('/api/v1/auth/login')
          .send({ email: users[0].email, password: 'wrongPassword' })
          .expect(httpStatus.BAD_REQUEST)
          .then((result) => {
            expect(result.body.message).to.equal(messages.INVALID_EMAIL_OR_PASSWORD);
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
    describe('should return 200', () => {
      it('when new user is registered', () => {
        return request(app)
          .post('/api/v1/auth/register')
          .send({ email: 'new@test.com', password: 'password', confirmPassword: 'password' })
          .expect(httpStatus.OK)
          .then((result) => {
            expect(result.body.token).to.exist;
          });
      });
    });

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

      it('when user exists', () => {
        return request(app)
          .post('/api/v1/auth/register')
          .send({ email: users[0].email, password: 'password', confirmPassword: 'password' })
          .expect(httpStatus.BAD_REQUEST)
          .then((result) => expect(result.body.message).to.equal(messages.USER_EXISTS));
      });
    });
  });

  describe('GET /api/v1/auth/token', () => {
    describe('should return 200', () => {
      it('when token is valid', async () => {
        const {
          body: { token },
        } = await request(app)
          .post('/api/v1/auth/login')
          .send({ email: users[0].email, password: 'password' })
          .expect(httpStatus.OK);

        return request(app)
          .get('/api/v1/auth/token')
          .auth(token, { type: 'bearer' })
          .expect(httpStatus.OK)
          .then((results) => {
            const { id, timestamp } = results.body;
            expect(id).to.exist;
            expect(timestamp).to.exist;
          });
      });
    });
    describe('should return 400', () => {
      it('when using invalid token', () => {
        const token = 'invalid-token';

        return request(app).get('/api/v1/auth/token').auth(token, { type: 'bearer' }).expect(httpStatus.UNAUTHORIZED);
      });
    });
  });
});
