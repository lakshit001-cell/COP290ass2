import {Schema, model, Types} from 'mongoose';

const taskSchema = new Schema(
    {
        name: {type: String, required: true},
        description: {type: String},
        type: {type:String, enum: ['Story', 'Task', 'Bug'], required: true},
        priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] }, 
        status: { type: String, required: true }, // The column in which it is in
        assignee: { type: Schema.Types.ObjectId, ref: 'User' }, //assigned to user
        reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        parentStory: { type: Schema.Types.ObjectId, ref: 'Task' }, 
        kanban: { type: Schema.Types.ObjectId, ref: 'Kanban', required: true },
        deadline: { type: Date },
        
        // Audit history 
        history: [{
            field: String, // "status", "assignee", etc.
            oldValue: Schema.Types.Mixed,
            newValue: Schema.Types.Mixed,
            changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
            timestamp: { type: Date, default: Date.now }
        }],
    },
    {timestamps: true}
);

export const Task = model('Task', taskSchema);