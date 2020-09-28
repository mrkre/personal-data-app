import { DocumentQuery } from 'mongoose';
import Profile, { ProfileDocument } from '../models/Profile';
import { Service } from 'service';
import { encrypt, decrypt } from '../util/crypto';
// import messages from '../messages/profile';

class ProfileService implements Service {
  public name: string;

  constructor() {
    this.name = 'ProfileService';
  }

  get = (userId: string): DocumentQuery<ProfileDocument | null, ProfileDocument, {}> => {
    return Profile.findOne({ user: userId });
  };

  encryptFields = (key: string, params: Record<string, unknown>) => {
    const entries: [string, unknown][] = Object.entries(params);
    return entries.reduce((obj: Record<string, unknown>, [field, value]) => {
      if (typeof value === 'object') {
        obj[field] = this.encryptFields(key, value as Record<string, unknown>);
      } else {
        obj[field] = encrypt(key, value as string);
      }
      return obj;
    }, {});
  };

  createOrUpdate = async <V>(
    userId: string,
    key: string,
    params: Record<string, V>,
  ): Promise<DocumentQuery<ProfileDocument | null, ProfileDocument>> => {
    const fields = this.encryptFields(key, params);

    return Profile.findOneAndUpdate({ user: userId }, { $set: fields }, { new: true });
  };
}

export default ProfileService;
