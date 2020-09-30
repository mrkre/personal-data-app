import { expect } from 'chai';
import { Types } from 'mongoose';
import Profile from '../../src/models/Profile';
import ProfileService from '../../src/services/profile';
import { encrypt, decrypt } from '../../src/util/crypto';
import setupDb from '../db';

describe('(Services) ProfileService', () => {
  setupDb();

  const key = 'kx7MVPcev9UfAGYvbezbixRWunqVF9Ge56tgvIuIcRw=';

  const profileService = new ProfileService();

  describe('get', () => {
    it('should return empty', async () => {
      const profile = await profileService.get(Types.ObjectId().toString());

      expect(profile).to.be.null;
    });
    it('should return Profile without key', async () => {
      const userId = Types.ObjectId().toString();

      await Profile.create({ user: userId, firstName: 'Peter', lastName: 'Parker' });

      const profile = await profileService.get(userId);

      expect(profile).to.exist;
    });
    it('should return decrypted Profile with key', async () => {
      const userId = Types.ObjectId().toString();

      const params = {
        firstName: 'Bruce',
        lastName: 'Wayne',
        city: 'Gotham',
        country: 'US',
      };

      const encryptedProfile = await Profile.create({
        user: userId,
        firstName: encrypt(key, params.firstName),
        lastName: encrypt(key, params.lastName),
        address: {
          city: encrypt(key, params.city),
          country: encrypt(key, params.country),
        },
      });

      expect(encryptedProfile.firstName).to.not.equal(params.firstName);

      const decryptedProfile = await profileService.get(userId, key);

      expect(decryptedProfile.firstName).to.equal(params.firstName);
    });
  });

  describe('createOrUpdate', () => {
    it('should upsert and encrypt fields', async () => {
      const userId = Types.ObjectId().toString();

      const params = {
        firstName: 'Steve',
        lastName: 'Banner',
        address: { city: 'New York', country: 'US' },
      };

      await profileService.createOrUpdate(userId, key, params);

      const profile = await Profile.findOne({ user: userId });

      expect(profile.firstName).to.not.equal(params.firstName);
      expect(decrypt(key, profile.firstName)).to.equal(params.firstName);
    });
  });
});
