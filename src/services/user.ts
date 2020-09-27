import User, { UserDocument } from '../models/User';
import { Service } from 'service';

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
}

export default UserService;
