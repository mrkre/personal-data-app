import User from '../../src/models/User';
import { expect } from 'chai';
import setupDb from '../db';

describe('(Models) User', () => {
  setupDb();

  describe('should create User object', () => {
    it('with valid credentials', async () => {
      const email = 'test@test.com';
      const password = 'password';

      const user = new User({ email, password });
      await user.save();

      const savedUser = await User.findOne({ email });

      expect(savedUser).to.exist;
      expect(savedUser.password).to.not.equal(password);

      const isMatch = await user.validatePassword(password);
      expect(isMatch).to.be.true;
    });
  });

  describe('should throw error', () => {
    it('with invalid email', () => {
      const email = 'userATtest.com';

      const user = new User({ email, password: 'password' });

      return user
        .save()
        .then((res) => expect(res).to.not.exist)
        .catch((err) => {
          expect(err.message).to.equal(`users validation failed: email: ${email.toLowerCase()} is not a valid email`);
        });
    });
  });
});
