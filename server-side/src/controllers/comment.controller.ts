import { Request, Response } from 'express';
import { Comment } from "../models/comments";
import { Task } from "../models/task";
import { Noti } from '../models/notification';

export const postComment = async (req: any, res: Response) => {
    try{
        const {taskId} = req.params;
        const {body, mention} = req.body;

        const addComment = await Comment.create({
            task: taskId,
            author: req.user._id || req.user.id,
            body: body,
            mention: mention
        })


        const populated =  await Comment.findById(addComment._id).populate('author', 'username').lean() //lean returns just the data.


        if(mention && mention.length > 0){
            const setNoti = mention.map((userId : any) => {
                if(userId === req.user.id) return null;

                return Noti.create({
                    recipient: userId,
                    sender: req.user.id,
                    content: `${req.user.username || 'Someone'} mentioned you in a comment.`,
                    type: 'mention',
                    link: `/project/${req.body.projectId}/task/${taskId}`
                })  
            })

            await Promise.all(setNoti.filter((p:any)=> p !== null));
        }
        const response = {
            author: (populated?.author as any).username,
            content: populated?.body,
            timestamp: new Date().toLocaleString
        }

        res.status(200).json(response);
    }catch(error){
        res.status(500).json({message: "Server error, comment", error});
    }
}

export const getCom = async (req: any, res: Response) => {
    try{
        const {taskId} = req.params;

        const comment = await Comment.find({task: taskId}).populate('author', 'username').sort({createdAt: 1});
        res.status(200).json({comment})
    }catch(error){
        res.status(500).json({message: "server error, getComment", error})
    }
}