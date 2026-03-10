import { Schema, model, Document } from 'mongoose';

// Interface (for TypeScript code hints)
export interface IUser extends Document {
  username: string;
  email: string;
  active: boolean;
}

// Schema (for MongoDB validation)
const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });


export const User = model<IUser>('User', userSchema);