import { Schema, Document, Model, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

export interface UserDocument extends Document {
  email: string;
  password: string;
  active: boolean;
  validatePassword: validatePasswordFunction;
}

type validatePasswordFunction = (passwordToValidate: string) => boolean;

const userSchema = new Schema(
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
    active: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  const user = this as UserDocument;

  // hash password only if it's modified or user is new
  if (user.isModified('password') || user.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(user.password, salt);

      return next();
    } catch (err) {
      return next(err);
    }
  }
});

const validatePassword: (passwordToValidate: string) => Promise<boolean | void> = function (
  passwordToValidate: string,
) {
  return bcrypt
    .compare(passwordToValidate, this.password)
    .then((isMatch) => isMatch)
    .catch((err) => {
      throw err;
    });
};

userSchema.methods.validatePassword = validatePassword;

const User: Model<UserDocument> = model<UserDocument>('users', userSchema);

export default User;
