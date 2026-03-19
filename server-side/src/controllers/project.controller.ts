import {Request, Response} from 'express';
import { Project } from '../models/project';
import {User} from '../models/user';

export const newProject = async (req: any, res: Response) => { // called after token Authentication.    
    try{
        const {name, deadline, priority, description} = req.body; // initialy only Admin/creater is member

        const newPro = await Project.create({
            name, deadline, priority, description,
            createdBy: req.user.id,
            members: [{user: req.user.id, role: 'Admin'}]
        })
        res.status(201).json({message: "Created Project", project: newPro})
    }catch(error){
        res.status(500).json({message: error}); //data base error
    }
}

export const userProjects = async (req: any, res: Response) => {
    try{
        console.log("Fetching user's projects")
        const projects = await Project.find({
            "members.user" : req.user.id,
            completed: false,
        });
        console.log("projects found", projects);
        res.status(200).json(projects);
    }catch(error){
        res.status(500).json({message: error}); //database error
    }
}

export const completedProjects = async (req: any, res: Response) => {
    try{
        const projects = await Project.find({
            "members.user" : req.user.id,
            completed: true,
        });
        console.log("projects found", projects);
        res.status(200).json(projects);
    }catch(error){
        res.status(500).json({message: "Server error", error});
    }
}

export const projectDetails = async (req: any, res: Response) => {
    try{
        const {id} = req.params;

        const project = await Project.findById(id).populate([
            {path: 'members.user', select: 'name email pfp'},
            {path: 'createdBy', select: 'name'}
        ])

        if(!project){
            return res.status(404).json({message: "project not found"});
        }

        const isMember = project.members.some((m:any) => m.user.toString() === req.user.id)

        if(!isMember && req.user.GlobalRole !== 'Admin') return res.status(403).json({message: "Not a member"});
       

        res.status(200).json(project);
    }catch(error){
        return res.status(500).json({message:"server error", error});
    }
}

export const updateProject = async (req: any, res: Response) => {
    try{
        const {id} = req.params;
        const {name, description, deadline, priority} = req.body;

        const project = await Project.findById(id);

        if(!project){
            return res.status(404).json({message: "Project not found"});
        }

        const isMember = project.members.find((m:any)=> m.user.toString()  === req.user.id);
        const authCheck = (req.user.GlobalRole === 'Admin') || (isMember && isMember.role === 'Admin');

        if(!authCheck){
            return res.status(403).json({message: "Authorization error"});
        }

        const changes = [];
        if(name && name!== project.name){
            changes.push({
            field: 'project name', // "status", "assignee", etc.
            oldValue: project.name,
            newValue: name,
            changedBy: req.user.id
        })};
        if(priority && priority!== project.priority){
            changes.push({
            field: 'priority', // "status", "assignee", etc.
            oldValue: project.priority,
            newValue: priority,
            changedBy: req.user.id
        })};
        if(description && description!== project.description){
            changes.push({
            field: 'description', // "status", "assignee", etc.
            oldValue: project.description,
            newValue: description,
            changedBy: req.user.id
        })};
        if(priority && priority!== project.priority){
            changes.push({
            field: 'priority', // "status", "assignee", etc.
            oldValue: project.priority,
            newValue: priority,
            changedBy: req.user.id
        })};
        if(deadline && deadline!== project.deadline){
            changes.push({
            field: 'deadline', // "status", "assignee", etc.
            oldValue: project.deadline,
            newValue: deadline,
            changedBy: req.user.id
        })};

        project.name = name || project.name;
        project.description = description || project.description;
        project.deadline = deadline || project.deadline;
        project.priority = priority || project.priority;

        if(changes.length > 0){ project.history.push(...changes) }

        await project.save();

        res.status(200).json({message: "Updated"});
    }catch(error){
        res.status(500).json({message: "Server error", error});
    }
}

export const endProject = async(req:any, res: Response) => {
    try{
        const {id} = req.params;

        const project = await Project.findById(id);
        if(!project){return res.status(404).json({message: "project not found"});}

        const member = project.members.find((m:any) => m.user.toString() === req.user.id)

        const Authorized = (req.user.GlobalRole === 'Admin') || (member && member.role === 'Admin');
        if(!Authorized) return res.status(403).json({message: "Unauthorized action"})
        
        project.completed = true; 
        
        project.history.push({
           field: 'Status',
           newValue: "Project Completed",
           changedBy: req.user.id
        });

        await project.save();
        return res.status(200).json({message: "Project ended"});
    }catch(error){
        return res.status(500).json({message: "server error", error});
    }
}

export const addMember  = async (req: any, res: Response) => {
    try{
        const {id} = req.params;
        const {email, role} = req.body;

        const project = await Project.findById(id);
        if(!project)  return res.status(404).json({message: "Project not found"})

        const adduser = await User.findOne({email});

        if(!adduser) return res.status(404).json({message: "user not found"});


        //add authorization check

        project.members.push({user:adduser._id, role: role });

        project.history.push({
            field: 'members',
            newValue: `Added ${adduser.username}`,
            changedby: req.user.id,
        });

        await project.save();
        res.status(201).json({message: "Added"})

    }catch(error){
        res.status(500).json({message: "sereve error", error})
    }
}

export const removeMember = async (req: any, res: Response) => {
    try{
        const {id} = req.params;
        const {email} = req.body;

        const project = await Project.findById(id);
        if(!project)  return res.status(404).json({message: "Project not found"})     
            
        const remUser = await User.findOne({email});
        if(!remUser) return res.status(404).json({message: "user not found"});

        const remMem = project.members.find((u:any) => u.user.toString() === remUser._id.toString()); // inorder to get project role.

        if(project.createdBy.toString() === remUser.toString() || (remUser._id.toString() === req.user.id)) {
            return res.status(400).json({message: "Cant remove the creator or yourself(accidental Lockout!)."})
        }
        
        const projadmins = project.members.filter( u => u.role === 'Admin').length;
        if(remMem && remMem.role === 'Admin'){
            if(projadmins <= 1) {
                return res.status(400).json({message: "Atleast one admin is required in the project"})
            }
        }

        project.members.pull({user: remUser._id});

        project.history.push({
            field: 'members',
            newValue: `Removed ${remUser.username}`,
            changedBy: req.user.id
        })

        await project.save();
        return res.status(200).json({message: "User Removed"})

    }catch(error){
        res.status(500).json({message: "server error", error})
    }
}