import { pick, omit } from 'lodash';
import Profile, { ProfileDocument } from '../models/Profile';
import { Service } from 'service';
import { encrypt, decrypt } from '../util/crypto';
import BadRequestException from '../exceptions/BadRequestException';
import messages from '../messages/profile';

interface ProfileDocumentResponse extends ProfileDocument {
  encrypted: boolean;
  success?: boolean;
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
    try {
      const entries: [string, unknown][] = Object.entries(params);
      return entries.reduce((obj: { [s: string]: unknown }, [field, value]) => {
        if (typeof value === 'object') {
          obj[field] = this.decryptFields(key, value as { [s: string]: unknown });
        } else {
          obj[field] = decrypt(key, value as string);
        }
        return obj;
      }, {});
    } catch (err) {
      throw new BadRequestException(messages.UNABLE_TO_DECRYPT);
    }
  };

  get = async (userId: string, key?: string) => {
    const profile = await Profile.findOne({ user: userId }).lean();

    if (!profile) {
      return null;
    }

    if (key) {
      const { user } = profile;

      let decrypted;
      let decryptSuccess;

      try {
        decrypted = this.decryptFields(key, pick(profile, this.fieldsToEncrypt));
        decryptSuccess = true;
      } catch (err) {
        if (err instanceof BadRequestException) {
          decrypted = pick(profile, this.fieldsToEncrypt);
          decryptSuccess = false;
        }
      }

      const rest = omit(profile, this.fieldsToEncrypt);

      return {
        user,
        ...decrypted,
        ...rest,
        encrypted: !decryptSuccess,
        success: decryptSuccess,
      } as ProfileDocumentResponse;
    }
    return {
      ...profile,
      encrypted: true,
    } as ProfileDocumentResponse;
  };

  createOrUpdate = async (userId: string, key: string, params: { [s: string]: unknown }) => {
    const fields = this.encryptFields(key, pick(params, this.fieldsToEncrypt));

    const rest = omit(params, this.fieldsToEncrypt);

    const profile: ProfileDocument = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: { ...fields, ...rest } },
      { upsert: true, new: true },
    ).lean();

    return {
      ...profile,
      encrypted: true,
    } as ProfileDocumentResponse;
  };
}

export default ProfileService;
