import { Request, Response } from 'express';
import { Kanban } from '../models/kanban.js';
import { Task } from '../models/task.js';
import { Project } from '../models/project.js';

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
        console.log(tasks)
        res.status(200).json(tasks);
    }catch(error){
        res.status(500).json({message: "server error", error});
    }
}

export const taskDetails = async (req:any, res: Response) => {
    try{
        const {taskId} = req.params;

        const task = await Task.findById(taskId);
        console.log(task);
        if(!task) return res.status(404).json({message: "Task not found"});
        console.log("TaskFound");
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


export const editTask = async (req: any, res: Response) => {
    try{
        const {taskId} = req.params;

        const changes = req.body;

        const task = await Task.findById(taskId);
        if(!task) return res.status(404).json({message: "Task not found"});

        const updates= [];
        if(changes.name && changes.name!== task.name){
            updates.push({
            field:  name, // "status", "assignee", etc.'
            oldValue: task.name,
            newValue: changes.name,
            changedBy: req.user.id
        })};
        if(changes.priority && changes.priority!== task.priority){
            updates.push({
            field: 'priority', // "status", "assignee", etc.
            oldValue: task.priority,
            newValue: changes.priority,
            changedBy: req.user.id
        })};
        if(changes.description && changes.description!== task.description){
            updates.push({
            field: 'description', // "status", "assignee", etc.
            oldValue: task.description,
            newValue: changes.description,
            changedBy: req.user.id
        })};
        if(changes.deadline && changes.deadline!== task.deadline){
            updates.push({
            field: 'deadline', // "status", "assignee", etc.
            oldValue: task.deadline,
            newValue: changes.deadline,
            changedBy: req.user.id
        })};
        if(changes.type && changes.type!== task.type){
            updates.push({
            field: 'Type', // "status", "assignee", etc.
            oldValue: task.type,
            newValue: changes.type,
            changedBy: req.user.id
        })};
        if(changes.description && changes.description!== task.description){
            updates.push({
            field: 'description', // "status", "assignee", etc.
            oldValue: task.description,
            newValue: changes.description,
            changedBy: req.user.id
        })};
        if(changes.parentStory && changes.parentStory!== task.parentStory){
            updates.push({
            field: 'Story', // "status", "assignee", etc.
            oldValue: task.parentStory,
            newValue: changes.parentStory,
            changedBy: req.user.id
        })};
        if(changes.assignee && changes.assignee.toString()!== task.assignee?.toString()){
            updates.push({
            field: 'Assigned Member', // "status", "assignee", etc.
            oldValue: task.assignee,
            newValue: changes.assignee,
            changedBy: req.user.id
        })};

        Object.assign(task, changes);
        if(updates.length > 0){ task.history.push(...updates) }

        await task.save();
        res.status(200).json(task);
    }catch(error){
        res.status(500).json({message: "server error", error});
    }
}

export const moveTask = async (req: any, res: Response) => {
    try{
        const {taskId} = req.params;

        const {newcol , initCol} = req.body;

        const task = await Task.findById(taskId);
        if(!task) return res.status(404).json({message: "Task not found"});

        task.status = newcol;
        task.history.push({
            field: "Task Status",
            oldValue: initCol,
            newValue: newcol
        })

        await task.save();
    }catch(error){
        res.status(500).json({message: "Server error"});
    }
}