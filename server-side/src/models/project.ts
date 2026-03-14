import {Schema, model, Types} from 'mongoose';

// Schema (for MongoDB validation)
const projectSchema = new Schema(
  {
    name: {type: String, required: true},
    deadline: {type: Date, required: [true, 'Please set a deadline.']},
    priority: {type: String, enum: ['Low', 'Medium', 'High'], default: 'Low'},
    description: {type: String, trim: true},
    createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    members: [{
        user: {type: Schema.Types.ObjectId,  ref: 'User'}, // to link to User Model
        role: {type: String, enum: ['Admin', 'Member', 'Viewer'], default: 'Member'}
    }]
  },
  {timestamps: true},
);

export const Project = model('Project', projectSchema);
