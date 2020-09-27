import { DocumentQuery } from 'mongoose';
import User, { UserDocument } from '../models/User';
import { Service } from 'service';
import { BadRequestException } from '../exceptions';
import messages from '../messages/auth';

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
      // throw generic error to prevent malicious user from guessing
      throw new BadRequestException(messages.INVALID_EMAIL_OR_PASSWORD);
    }

    const user = new User({ email, password });

    return user.save();
  };
}

export default UserService;
