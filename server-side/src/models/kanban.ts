import {Schema, model, Types} from 'mongoose';
import { timeStamp } from 'node:console';

const kanbanSchema = new Schema(
    {   project: {type: Schema.Types.ObjectId, ref: 'Project', required: true}, // reference to parent project.
        name: {type: String, required: true},
        columns: [{
            name: { type: String, required: true },
            ordered: {type: Number, required: true}
        }]
    },
    {timestamps: true}
);

export const Kanban = model('Kanban', kanbanSchema);