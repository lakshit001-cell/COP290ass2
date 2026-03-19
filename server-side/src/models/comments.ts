import {Schema, model, Types} from 'mongoose';

const commentSchema = new Schema({
    task: {type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    body: {type: String, required: true},
    mention: [{type: Schema.Types.ObjectId, ref: 'User'}]
},
    {timestamps: true}
);

export const Comment = model('Comment', commentSchema);
