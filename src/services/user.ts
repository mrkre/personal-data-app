import { DocumentQuery } from 'mongoose';
import User, { UserDocument } from '../models/User';
import { Service } from 'service';
import { BadRequestException } from '../exceptions';
import messages from '../messages/auth';

/**
 * @class UserService
 */
class UserService implements Service {
  public name: string;

  constructor() {
    this.name = 'UserService';
  }

  findOneByEmail = (email: string): DocumentQuery<UserDocument | null, UserDocument, {}> => {
    return User.findOne({ email });
  };

  findOneById = (id: string): DocumentQuery<UserDocument | null, UserDocument, {}> => {
    return User.findOne({ _id: id });
  };

  create = async (email: string, password: string): Promise<UserDocument> => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestException(messages.USER_EXISTS);
    }

    const user = new User({ email, password });

    return user.save();
  };
}

export default UserService;
