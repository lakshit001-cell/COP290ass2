import { Schema, model } from 'mongoose';

const notificationSchema = new Schema({
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['mention', 'assignment', 'new_project'], 
        required: true 
    },
    link: { type: String },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

export const Noti = model('Noti', notificationSchema);