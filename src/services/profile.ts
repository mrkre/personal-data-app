import { pick, omit } from 'lodash';
import Profile, { ProfileDocument } from '../models/Profile';
import { Service } from 'service';
import { encrypt, decrypt } from '../util/crypto';

interface ProfileDocumentObject extends ProfileDocument {
  encrypted: boolean;
}

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
        encrypted: true,
      } as ProfileDocumentObject;
    }
    return {
      ...profile,
      encrypted: false,
    };
  };

  createOrUpdate = async (userId: string, key: string, params: { [s: string]: unknown }) => {
    const fields = this.encryptFields(key, pick(params, this.fieldsToEncrypt));

    const rest = omit(params, this.fieldsToEncrypt);

    const profile: ProfileDocument = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: { ...fields, ...rest } },
      { upsert: true, new: true },
    );

    return {
      ...profile,
      encrypted: true,
    } as ProfileDocumentObject;
  };
}

export default ProfileService;
