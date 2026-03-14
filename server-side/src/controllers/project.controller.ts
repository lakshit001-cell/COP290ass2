import {Request, Response} from 'express';
import { Project } from '../models/project';

export const newProject = async (req: any, res: Response) => { // called after token Authentication.    
    try{
        const {name, deadline, priority, description} = req.body; // initialy only Admin/creater is member

        const newPro = await Project.create({
            name, deadline, priority, description,
            createdBy: req.user.id,
            members: [{User: req.user.id, role: 'Admin'}]
        })
        res.status(201).json({message: "Created Project", project: newPro})
    }catch(error){
        res.status(500).json({message: error});
    }
}