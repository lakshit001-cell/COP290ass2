import {Schema, model, Types} from 'mongoose';
import { timeStamp } from 'node:console';

const kanbanSchema = new Schema(
    {   project: {type: Schema.Types.ObjectId, ref: 'Project', required: true}, // reference to parent project.
        name: {type: String, required: true},
        description: {type: String},
        deadline: {type: Date},
        priority: {type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low'},
        columns: [{
            name: { type: String, required: true },
            ordered: {type: Number, required: true},
            wipLimit: {type: Number, default: 0},
        }]
    },
    {timestamps: true}
);

export const Kanban = model('Kanban', kanbanSchema);