import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  email: string;
  name?: string;
  password: string;
  age?: number;
  verificationCode?: string;
  codeExpiredAt?: Date;
  isVerified: boolean;
  create_at: Date;
  updated_at: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String, required: true },
    age: { type: Number },
    verificationCode: { type: String, default: null },
    codeExpiredAt: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "create_at", updatedAt: "updated_at" },
  },
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
