import {Schema, model} from 'mongoose';

// Schema (for MongoDB validation)
const userSchema = new Schema(
  {
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    hashed: {type: String, required: true},
    
  },
  {timestamps: true},
);

export const User = model('User', userSchema);
