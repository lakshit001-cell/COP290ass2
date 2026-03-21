import { Request, Response } from 'express';
import { Kanban } from '../models/kanban.js';
import { Project } from '../models/project.js';

export const createBoard = async (req: any, res: Response) => {
    try{
        const {projId, name, description, deadline, priority} = req.body;

        const project = await Project.findById(projId);
        if(!project) return res.status(404).json({message: "Project not found"});

        const newcolumns = [
            {name: "To Do", ordered: 0, wipLimit: 0},
            {name: "In Progress", ordered: 1, wipLimit: 10},
            {name: "In Review", ordered: 2, wipLimit: 10},
            {name: "Done", ordered: 3, wipLimit: 0},
        ];

        const board = await Kanban.create({
            project: projId,
            name: name,
            description: description,
            deadline: deadline,
            priority: priority,
            columns: newcolumns,

        })

        project.history.push({
            field: "Board",
            newValue: `Board ${name} created`,
            changedBy: req.user.id
        })

        await project.save();
        res.status(201).json({message: "Boad created", board});
    }catch(error){
        res.status(500).json({message: "sserver error", error});
    }
}

export const projBoards = async (req: any, res: Response) => {
    try{
        const {id} = req.params;

        const boards = await Kanban.find({project: id});

        res.status(200).json(boards);
    }catch(error){
        res.status(500).json({message: "server error", error});
    }
}