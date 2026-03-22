import { Request, Response } from 'express';
import { Kanban } from '../models/kanban.js';
import { Task } from '../models/task.js';
import { Project } from '../models/project.js';
import { Noti } from '../models/notification.js';

interface TaskData {
    name: string;
    description: string;
    type: string;
    priority: string;
    status: string;
    assignee?: string;
    reporter: string;
    kanban: string;
    deadline?: Date;
    parentStory?: string; 
} 

export const createTask = async (req: any, res: Response) => {
    try{
        const {boardId} = req.params;
        const {type, name, story, column, description, assignee, deadline, priority} = req.body;

        const board = await Kanban.findById(boardId);
        if(!board) return res.status(404).json({message: "board not found"});



        const taskData : TaskData= {
            name: name,
            description: description,
            type: type,
            priority: priority, 
            status: column, // The column in which it is in
            reporter: req.user._id || req.user.id, 
            kanban: boardId,
        };

        if (assignee && assignee.trim() !== "") taskData.assignee = assignee;
        if (deadline && deadline.trim() !== "") taskData.deadline = deadline;
        if (story && story.trim() !== "" && story !== "Independent") taskData.parentStory = story;

        const task = await Task.create(taskData);

        task.history.push({
            field: "Task",
            newValue: `Task ${name} created`,
            changedBy: req.user._id || req.user.id
        })

        if (assignee && assignee !== "") {
            await Noti.create({
                recipient: assignee,
                content: `New task '${task.name}' assigned to you by ${req.user.username}.`,
                type: 'assignment'
            });
        }

        await task.save();
        res.status(201).json({message: "Task created", task});
    }catch(error:any){
        console.error("ERROR:", error.message);
        res.status(500).json({message: "sserver error", 
            error: error.message});
    }
}

export const getTasks = async (req: any, res: Response) => {
    try{
        const {boardId} = req.params;

        const tasks = await Task.find({kanban: boardId});
        res.status(200).json(tasks);
    }catch(error){
        res.status(500).json({message: "server error", error});
    }
}

export const taskDetails = async (req:any, res: Response) => {
    try{
        const {taskId} = req.params;

        const task = await Task.findById(taskId).populate('assignee', 'username');
        if(!task) return res.status(404).json({message: "Task not found"});
        res.status(200).json(task);
    }catch(error){
        res.status(500).json({message: "server error", error});
    }
}

export const getMemetc = async (req: any, res: Response) => {
    try{
        const {id, boardId} = req.params;

        const board = await Kanban.findById(boardId);
        const project = await Project.findById(id).select('members');
        const stories = await Task.find({
            kanban: boardId,
            type: 'Story',
        })
        res.status(200).json({
            members: project?.members || [],
            stories: stories || [],
            board
        })
    }catch(error){
        res.status(500).json({message: "server error", error});
    }
}

interface ITaskUpdates {
    field: string;
    oldValue: any;
    newValue: any;
    changedBy: string; 
    timestamp?: Date;
}

export const editTask = async (req: any, res: Response) => {
    try{
        const {taskId} = req.params;

        const changes = req.body;

        const task = await Task.findById(taskId).populate('assignee').populate('parentStory', 'name');
        if(!task) return res.status(404).json({message: "Task not found"});

        const updates: ITaskUpdates[] = [];
        type TaskFields = 'name' | 'priority' | 'description' | 'deadline' | 'type' | 'parentStory' | 'assignee' | 'status';
        const trackChanges = (fieldthis: string, dbVal: TaskFields, newVal: any) =>{
            const currVal = (task as any)[dbVal];
            if(newVal !== undefined && String(newVal) !== String(currVal)){
                updates.push({
                    field: fieldthis,
                    oldValue: currVal,
                    newValue: newVal,
                    changedBy: req.user.id
                });
                return true;
            }
            return false;
        }

        trackChanges('Name', 'name', changes.name);
        trackChanges('Priority', 'priority', changes.priority);
        trackChanges('Description', 'description', changes.description);
        trackChanges('Type', 'type', changes.type);

        const oldAssign = task.assignee ? (task.assignee as  any)._id.toString() : null;
        const newAssign = (changes.assignee && changes.assignee !== "Unassigned") ? changes.assignee.toString() : null;


        if(oldAssign !== newAssign){
            updates.push({
                field: 'Assignee',
                oldValue: (task.assignee as any)?.username || "Unassigned",
                newValue: newAssign? "Changed" : "Unassigned",
                changedBy: req.user.id
            })
        }

        const getISOString = (date: any) => {
            if (!date) return "";
            if (typeof date === 'string' && date.length === 10) return date;
            return new Date(date).toISOString().split('T')[0];
            
        };
        const oldDeadline = getISOString(task.deadline);
        const newDeadline = getISOString(changes.deadline);

        if(oldDeadline !== newDeadline){
            updates.push({
                field: 'Deadline',
                oldValue: oldDeadline,
                newValue: newDeadline,
                changedBy: req.user.id
            })
        }

        const oldStory = task.parentStory ? (task.parentStory as any).name : "Independent";
        let newStory = "Independent";
        if (changes.parentStory && typeof changes.parentStory === 'object') {
            newStory = changes.parentStory.name || "Independent";
        } else if (changes.parentStory && changes.parentStory !== "Independent") {
            newStory = "Changed Story"; 
        }

        if (oldStory !== newStory) {
            updates.push({
                field: 'Story',
                oldValue: oldStory || "Independent",
                newValue: newStory || "Independent",
                changedBy: req.user.id
            });
        }

        if (changes.name) task.name = changes.name;
        if (changes.priority) task.priority = changes.priority;
        if (changes.description) task.description = changes.description;
        if (changes.deadline) task.deadline = changes.deadline;
        task.parentStory = (changes.parentStory === "" || changes.parentStory === "Independent") ? null : changes.parentStory;
        task.assignee = newAssign;

        if (newAssign && oldAssign !== newAssign) {
            await Noti.create({
                recipient: newAssign,
                content: `New task '${task.name}' assigned to you by ${req.user.name}.`,
                type: 'assignment'
            });
        }
        
        if(updates.length > 0){ task.history.push(...updates as any) }

        await task.save();
        const updated = await Task.findById(taskId).populate('assignee')
        res.status(200).json(updated);
    }catch(error){
        res.status(500).json({message: "server error", error});
    }
}

export const moveTask = async (req: any, res: Response) => {
    try{
        const {taskId} = req.params;

        const {newcol , oldCol} = req.body;

        const task = await Task.findById(taskId);
        if(!task) return res.status(404).json({message: "Task not found"});

        task.status = newcol;
        task.history.push({
            field: "Task Status",
            oldValue: oldCol,
            newValue: newcol
        })

        await task.save();
        res.status(200).json({message: "moved", task});
    }catch(error){
        res.status(500).json({message: "Server error"});
    }
}