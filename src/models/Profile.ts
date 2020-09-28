import { Schema, Document, Model, model, Types } from 'mongoose';

export interface Address {
  street: string;
  city: string;
  unit?: string;
  country: string;
  postalCode: string;
}

export interface ProfileDocument extends Document {
  user: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  address: Address;
  phone: string;
}

const profileSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    address: {
      street: String,
      city: String,
      unit: String,
      country: String,
      postalCode: String,
    },
    phone: String,
  },
  { timestamps: true },
);

const Profile: Model<ProfileDocument> = model<ProfileDocument>('profiles', profileSchema);

export default Profile;
