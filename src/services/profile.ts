import { pick, omit } from 'lodash';
import { DocumentQuery } from 'mongoose';
import Profile, { ProfileDocument } from '../models/Profile';
import { Service } from 'service';
import { encrypt, decrypt } from '../util/crypto';
// import messages from '../messages/profile';

/**
 * @class ProfileService
 */
class ProfileService implements Service {
  public name: string;
  public fieldsToEncrypt: Array<string>;

  constructor() {
    this.name = 'ProfileService';
    this.fieldsToEncrypt = ['firstName', 'lastName', 'address', 'dateOfBirth', 'phone'];
  }

  private encryptFields = (key: string, params: { [s: string]: unknown }) => {
    console.log('params >>', params);
    const entries: [string, unknown][] = Object.entries(params);
    return entries.reduce((obj: { [s: string]: unknown }, [field, value]) => {
      if (typeof value === 'object') {
        obj[field] = this.encryptFields(key, value as { [s: string]: unknown });
      } else {
        obj[field] = encrypt(key, value as string);
      }
      return obj;
    }, {});
  };

  private decryptFields = (key: string, params: { [s: string]: unknown }) => {
    const entries: [string, unknown][] = Object.entries(params);
    return entries.reduce((obj: { [s: string]: unknown }, [field, value]) => {
      if (typeof value === 'object') {
        obj[field] = this.decryptFields(key, value as { [s: string]: unknown });
      } else {
        obj[field] = decrypt(key, value as string);
      }
      return obj;
    }, {});
  };

  get = async (userId: string, key?: string) => {
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return null;
    }

    if (key) {
      const { user } = profile;

      const decrypted = this.decryptFields(key, pick(profile.toObject(), this.fieldsToEncrypt));
      const rest = omit(profile, this.fieldsToEncrypt);

      return {
        user,
        ...decrypted,
        ...rest,
      } as ProfileDocument;
    }
    return profile;
  };

  createOrUpdate = async (
    userId: string,
    key: string,
    params: { [s: string]: unknown },
  ): Promise<DocumentQuery<ProfileDocument | null, ProfileDocument>> => {
    const fields = this.encryptFields(key, pick(params, this.fieldsToEncrypt));

    const rest = omit(params, this.fieldsToEncrypt);

    return Profile.findOneAndUpdate({ user: userId }, { $set: { ...fields, ...rest } }, { upsert: true, new: true });
  };
}

export default ProfileService;
