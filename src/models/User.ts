import mongoose, { PassportLocalSchema } from 'mongoose';
import validator from 'validator';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate: { validator: validator.isEmail, message: '{VALUE} is not a valid email', isAsync: false },
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

userSchema.plugin(passportLocalMongoose, { userNameField: 'email' });

const User = mongoose.model('users', userSchema as PassportLocalSchema);

export default User;
