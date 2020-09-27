import User, { UserDocument } from '../models/User';
import { Service } from 'service';
import BadRequestException from '../exceptions/BadRequestException';

class UserService implements Service {
  public name: string;

  constructor() {
    this.name = 'UserService';
  }

  findOneByEmail = (email: string): UserDocument | {} => {
    return User.findOne({ email });
  };

  findOneById = (id: string): UserDocument | {} => {
    return User.findOne({ _id: id });
  };

  create = async (email: string, password: string): Promise<UserDocument> => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // throw generic error to prevent malicious user from guessing
      throw new BadRequestException('Email and password combination does not match');
    }

    const user = new User({ email, password });

    return user.save();
  };
}

export default UserService;
