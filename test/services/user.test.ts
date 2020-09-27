import { expect } from 'chai';
import User from '../../src/models/User';
import UserService from '../../src/services/user';
import setupDb from '../db';

describe('(Services) UserService', () => {
  setupDb();

  const email = 'test@test.com';
  const password = 'password';
  const userService = new UserService();

  let userId: string;

  beforeAll(async () => {
    const user = await User.create({ email, password });
    userId = user.id;
  });

  describe('findOneByEmail', () => {
    it('should return user', async () => {
      const user = await userService.findOneByEmail(email);
      expect(user).to.exist;
    });
    it('should return null', async () => {
      const user = await userService.findOneByEmail('unknown@test.com');
      expect(user).to.be.null;
    });
  });

  describe('findOneById', () => {
    it('should return user', async () => {
      const user = await userService.findOneById(userId);
      expect(user).to.exist;
    });
    it('should return null', async () => {
      const user = await userService.findOneById('5f3b34f5346b9f00099472bc');
      expect(user).to.be.null;
    });
  });

  describe('create', () => {
    it('should create new user', async () => {
      const user = await userService.create('new@test.com', password);
      expect(user).to.exist;
    });
    it('should reject existing user', () => {
      return userService
        .create(email, password)
        .then((res) => expect(res).to.not.exist)
        .catch((err) => {
          expect(err).to.exist;
          expect(err.message).to.equal('Email and password combination does not match');
        });
    });
  });
});
